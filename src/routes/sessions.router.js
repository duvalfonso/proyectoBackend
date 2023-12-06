import { Router } from 'express'
import userModel from '../dao/mongo/models/user.js'
// import { createHash, isValidPassword } from '../utils.js'

const router = Router()

router.post('/register', async (req, res) => {
  const result = await userModel.create(req.body)
  res.send({ status: 'success', payload: result })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email, password })
  if (!user) return res.status(400).send({ status: 'error', error: 'Usuario o contraseña incorrectos' })

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email
  }

  res.status(200).json({ status: 'success', message: 'Loging in' })
})

router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
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

export default router
