const { authenticate } = require('@feathersjs/authentication')

const authenticationMiddleware = (req, res, next) => {
  if (req.path === '/authentication' || req.path === '/users') {
    return next()
  }
  
  authenticate('jwt')(req, res, next)
}

module.exports = authenticationMiddleware
