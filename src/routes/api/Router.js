import { Router } from 'express'
import { passportCall } from '../../services/auth.js'
import attachLogger from '../../middlewares/logger.js'

export default class BaseRouter {
  constructor () {
    this.router = Router()
    this.init()
  }

  init () {}
  getRouter = () => this.router

  get (path, policies, ...callbacks) {
    this.router.get(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  post (path, policies, ...callbacks) {
    this.router.post(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  put (path, policies, ...callbacks) {
    this.router.put(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  delete (path, policies, ...callbacks) {
    this.router.delete(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = message => res.send({ status: 'success', message })
    res.sendSuccessWithPayload = payload => res.send({ status: 'success', payload })
    res.sendInternalError = error => res.status(500).send({ status: 'error', error })
    res.sendUnauthorized = error => res.status(400).send({ status: 'error', error })
    next()
  }

  // handlePolicies = policies => {
  //   return (req, res, next) => {
  //     if (policies[0] === 'PUBLIC') return next()
  //     const user = req.user
  //     if (policies[0] === 'NO_AUTH' && user) return res.status(401).send({ status: 'error', error: 'Unauthorized' })
  //     if (policies[0] === 'NO_AUTH' && !user) return next()

  //     if (!user) return res.status(401).send({ status: 'error', error: req.error })
  //     if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: 'error', error: 'Forbidden' })
  //     next()
  //   }
  // }

  handlePolicies = policies => {
    return (req, res, next) => {
      if (policies[0] === 'PUBLIC') return next()
      const user = req.user

      // Check if the endpoint allows unauthenticated access
      if (policies[0] === 'NO_AUTH') {
        // If the user is authenticated, return Unauthorized
        if (user) return res.status(401).send({ status: 'error', error: 'Unauthorized' })
        return next()
      }

      // Check if the user is authenticated
      if (!user) return res.status(401).send({ status: 'error', error: 'Unauthorized' })

      // Check if the user's role has permission to access the endpoint
      const userRole = user.role.toLowerCase() // Converting to lowercase to match enum values
      if (!policies.includes(userRole)) {
        return res.status(403).send({ status: 'error', error: 'Forbidden' })
      }

      // If the user's role is allowed, proceed with the next middleware or route handler
      next()
    }
  }

  applyCallbacks (callbacks) {
    return callbacks.map(callback => async (...params) => {
      try {
        await callback.apply(this, params)
      } catch (err) {
        params[1].sendInternalError(err)
      }
    })
  }
}
