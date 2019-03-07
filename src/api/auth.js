const express = require('express');

const apiAuth = express.Router();
const passport = require('passport');

const logger = require('../logger').logger;

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
  logger.debug(req);
  logger.debug(res);
  passport.authenticate('auth0', (err, user, info) => {
    logger.debug(user);
    logger.debug(info);
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
