import { Router } from 'express'
import UserModel from '../../dao/mongo/models/user.js'
import usersController from '../../controllers/users.controller.js'
import { passportCall } from '../../services/auth.js'

const router = Router()

router.get('/profile/carts', passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
  if (!req.user) return res.redirect('/login')
  try {
    if (req.user) {
      const user = await UserModel.findById(req.user.id).populate('cart')
      res.send({ status: 'success', payload: user })
    } else {
      res.status(401).send({ status: 'error', error: 'Unauthorized' })
    }
  } catch (err) {
    req.logger.error(err)
    res.status(500).send({ status: 'error', error: err.message })
  }
}
)

router.get('/', usersController.getUsers)
router.get('/:uid', usersController.getUserById)

router.post('/reset-password', usersController.resetPassword)
router.get('/reset-password/:code/:uid', usersController.verifyResetToken)
router.post('/reset-password/:code/:uid', usersController.setNewPass)
router.put('/premium/:uid', passportCall('jwt', { strategyType: 'jwt', session: false }), usersController.updateUserRole)

export default router
