const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');

const { logger } = require('../logger');

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

const getUser = (req, res, next) => {
  const options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    headers: {
      'content-type': 'application/json',
      'Authorization': `${req.get('Authorization')}`
    },
    json: true,
  };
  new Promise((resolve, reject) =>
    request(options, (error, response, body) =>
      error ? reject(new Error(error)) : resolve(body)
    )
  )
    .then(user => {
      user.sub = user.sub.substring(6);
      req.user = user;
      next();
    })
    .catch(err => logger.error(err));
};

const login = (email, password) => {
  const options = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: {
      grant_type: 'password',
      username: email,
      password,
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'read:sample openid',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    },
    json: true,
  };

  logger.info('Contacting Auth0 ...');
  return new Promise((resolve, reject) =>
    request(options, (error, response, body) =>
      error ? reject(new Error(error)) : resolve(body.access_token)
    )
  );
};

const signup = (email, password, metadata) => {
  const options = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
    headers: { 'content-type': 'application/json' },
    body: {
      client_id: process.env.AUTH0_CLIENT_ID,
      email,
      password,
      connection: 'Formaviz-Auth0-Database',
      user_metadata: metadata || {},
    },
    json: true,
  };

  logger.info('Contacting Auth0 ...');
  return new Promise((resolve, reject) =>
    request(options, (error, response, body) =>
      error ? reject(new Error(error)) : resolve(body)
    )
  );
};

module.exports = { checkJwt, getUser, login, signup };
