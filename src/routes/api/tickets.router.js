import { Router } from 'express'
import ticketsController from '../../controllers/tickets.controller.js'
import { passportCall } from '../../services/auth.js'

const router = Router()

router.get('/', passportCall('jwt', { strategyType: 'jwt' }), ticketsController.getTickets)
router.post('/', passportCall('jwt', { strategyType: 'jwt' }), ticketsController.createTicket)

export default router
