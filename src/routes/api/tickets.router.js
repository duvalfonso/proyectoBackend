import { Router } from 'express'
import ticketsController from '../../controllers/tickets.controller.js'
import passport from 'passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), ticketsController.getTickets)
router.post('/', passport.authenticate('jwt', { session: false }), ticketsController.createTicket)

export default router
