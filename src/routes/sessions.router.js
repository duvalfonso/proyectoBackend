import { Router } from 'express'
import passport from 'passport'
import UserModel from '../dao/mongo/models/user.js'
import { createHash, isValidPassword } from '../utils.js'

const router = Router()

// router.post('/register', async (req, res) => {
//   const {
//     body: {
//       firstName,
//       lastName,
//       email,
//       password,
//       age
//     }
//   } = req
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !password
//   ) {
//     res.status(400).json({ message: 'Completa los campos requeridos' })
//   }

//   const user = await UserModel.create({
//     firstName,
//     lastName,
//     email,
//     password: createHash(password),
//     age
//   })
//   res.json({ status: 'success', payload: user })
// })

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
  req.session.user = req.user
  res.send({ status: 'success', message: 'User registered' })
})

router.get('/failregister', async (req, res) => {
  console.error('Failed Strategy')
  res.send({ error: 'Failed' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
  req.session.user = req.user
  res.redirect('/')
})

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body
//   const user = await UserModel.findOne({ email })
//   if (!user) return res.status(400).send({ status: 'error', error: 'Correo o contraseña inválidos' })

//   const isNotValidPassword = !isValidPassword(password, user)
//   if (isNotValidPassword) {
//     return res.status(401).json({ message: 'Correo o contraseña inválidos' })
//   }

//   req.session.user = {
//     name: `${user.firstName} ${user.lastName}`,
//     email: user.email,
//     role: user.role
//   }

//   res.status(200).json({ status: 'success', message: 'Loging in' })
// })

router.post('/recover-password', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Completa los campos requeridos.' })
  }
  const user = await UserModel.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Correo o contraseña inválidos' })
  }
  user.password = createHash(password)
  await UserModel.updateOne({ email }, user)
  res.redirect('/login')
})

router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  console.log(req.session.user)
  res.status(200).json(req.session.user)
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.redirect('/login')
  })
})

router.get('/github')
router.get('/github/callback')

export default router
