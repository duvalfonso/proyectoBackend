// import { Router } from 'express'
// import UserModel from '../../dao/mongo/models/user.js'
import usersController from '../../controllers/users.controller.js'
import { passportAuth } from '../../services/auth.js'
import uploader from '../../services/uploader.js'

// const router = Router()

// router.get('/profile/carts', passportAuth, async (req, res) => {
//   if (!req.user) return res.redirect('/login')
//   try {
//     if (req.user) {
//       const user = await UserModel.findById(req.user.id).populate('cart')
//       res.send({ status: 'success', payload: user })
//     } else {
//       res.status(401).send({ status: 'error', error: 'Unauthorized' })
//     }
//   } catch (err) {
//     req.logger.error(err)
//     res.status(500).send({ status: 'error', error: err.message })
//   }
// }
// )

// router.get('/', usersController.getUsers)
// router.get('/:uid', usersController.getUserById)
// router.post('/upload/:filetype', passportAuth, uploader.single('avatar'), usersController.uploadAvatar)
// router.post('/reset-password', usersController.resetPassword)
// router.get('/reset-password/:code/:uid', usersController.verifyResetToken)
// router.post('/reset-password/:code/:uid', usersController.setNewPass)
// router.put('/premium/:uid', passportAuth, usersController.updateUserRole)

// export default router

import BaseRouter from './Router.js'

export default class UsersRouter extends BaseRouter {
  init () {
    this.get('/', ['TEST', 'ADMIN', 'SUPERADMIN'], usersController.getUsers)
    this.get('/:uid', ['TEST', 'ADMIN', 'SUPERADMIN'], usersController.getUserById)
    this.get('/profile/cart', ['TEST', 'USER', 'PREMIUM', 'ADMIN', 'SUPERADMIN'], passportAuth, usersController.currentCart)
    this.post('/reset-password', usersController.resetPassword)
    this.post('/upload/:filetype', passportAuth, uploader.single('avatar'), usersController.uploadAvatar)
    this.get('/reset-password/:code/:uid', usersController.verifyResetToken)
    this.post('/reset-password/:code/:uid', usersController.setNewPass)
    this.put('/premium/:uid', passportAuth, usersController.updateUserRole)
  }
}
