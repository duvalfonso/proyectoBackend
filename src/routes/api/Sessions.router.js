import sessionsController from '../../controllers/sessions.controller.js'
import { passportAuth } from '../../services/auth.js'
import BaseRouter from './Router.js'

export default class SessionsRouter extends BaseRouter {
  init () {
    this.post('/register', ['NO_AUTH'], passportAuth, sessionsController.register)
    this.post('/login', ['NO_AUTH'], passportAuth, sessionsController.login)
    this.get('/current', ['TEST', 'USER', 'PREMIUM', 'ADMIN', 'SUPERADMIN'], sessionsController.current)
    this.post('/logout', ['TEST', 'USER', 'PREMIUM', 'ADMIN', 'SUPERADMIN'], sessionsController.logout)
  }
}
