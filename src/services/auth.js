import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)
export const validateCode = (code, user) => bcrypt.compareSync(code, user.resetPasswordCode)

export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error)
      if (!options.strategyType) {
        console.log(`Route ${req.url} doesn't have defined a strategyType`)
        return res.sendServerError()
      }

      if (!user) {
        switch (options.strategyType) {
          case 'jwt':
            req.error = info.message ? info.message : info.toString()
            return next()
          case 'locals':
            return res.sendUnauthorized(info.message ? info.message : info.toString())
          default:
            return res.status(401).send({ error: 'Unauthorized' })
        }
      }

      req.user = user
      next()
    })(req, res, next)
  }
}

export const generateToken = (user) => {
  return jwt.sign(user, `${config.jwt.TOKEN_SECRET}`, { expiresIn: '1h' })
}
