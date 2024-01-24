import { Router } from 'express'
import passport from 'passport'
import UserModel from '../../dao/mongo/models/user.js'
import usersController from '../../controllers/users.controller.js'

const router = Router()

router.get('/profile/carts', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate('cart')
  res.send({ status: 'success', payload: user })
}
)

router.get('/:uid', usersController.getUserById)

export default router
