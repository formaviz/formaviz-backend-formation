const express = require('express');

const apiAuth = express.Router();
const passport = require('passport');

const { login } = require('../controller/auth');
const { logger } = require('../logger');

apiAuth.post('/login', (req, res) => {
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password required',
      })
    : login(req.body.email, req.body.password)
        .then(access_token => {
          return access_token
            ? res.status(201).send({
                success: true,
                access_token: access_token,
              })
            : res.status(401).send({
                success: false,
                message: 'Authentication failed: wrong credentials',
              });
        })
        .catch(err => {
          logger.error(`Unable to process authentication: ${err}`);
          return res.status(500).send({
            success: false,
            message: err,
          });
        });
});

// Perform the login, after login Auth0 will redirect to callback
apiAuth.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
apiAuth.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/api/v1');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
apiAuth.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = apiAuth;
