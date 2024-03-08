import sessionsController from '../../controllers/sessions.controller.js'
import { passportCall } from '../../services/auth.js'
import BaseRouter from './Router.js'

export default class SessionsRouter extends BaseRouter {
  init () {
    this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'locals' }), sessionsController.register)
    this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), sessionsController.login)
    this.get('/current', ['test', 'user', 'premium', 'admin', 'superadmin'], sessionsController.current)
    this.post('/logout', ['PUBLIC'], sessionsController.logout)
  }
}
