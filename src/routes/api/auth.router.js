import { Router } from 'express'
import passport from 'passport'
import UserModel from '../../dao/mongo/models/user.js'
import { createHash } from '../../services/auth.js'

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
  req.session.user = req.user
  res.send({ status: 'success', message: 'User registered' })
})

router.get('/failregister', async (req, res) => {
  console.error('Failed Strategy')
  res.send({ error: 'Failed' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
  if (!req.user) return res.status(400).send({ status: 'error', message: 'Invalid credentials' })
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart
  }

  res.send({ status: 'success', payload: req.user })
  // res.redirect('/')
})

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

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.cookies.authToken) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const user = await UserModel.findById(req.user.id)
  // const userId = UserModel.findById(req.session.passport.user)
  // const completeUser = passport.deserializeUser(userId)
  // console.log(completeUser)
  res.status(200).json(user)
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.redirect('/login')
  })
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.session.passport.user
  res.redirect('/profile')
})

export default router
