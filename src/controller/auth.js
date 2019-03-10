// Load Passport
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const request = require('request');

const { logger } = require('../logger');

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) =>
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    done(null, profile)
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const login = (email, password) => {
  const options = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: {
      grant_type: 'password',
      username: email,
      password: password,
      audience: 'https://formavizz/api/v2',
      scope: 'read:sample',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    },
    json: true,
  };

  return new Promise((resolve, reject) =>
    request(options, (error, response, body) =>
      error ? reject(new Error(error)) : resolve(body.access_token)
    )
  );
};

module.exports = { login, passport };
