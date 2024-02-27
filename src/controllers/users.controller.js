import { usersService } from '../services/repositories.js'
import { generateToken, createHash, validateCode, validatePassword, verifyToken } from '../services/auth.js'
import MailingService from '../services/MailingService.js'
import DTemplates from '../constants/DTemplates.js'

const getUsers = async (req, res) => {
  const users = await usersService.getUsers()
  if (!users) return res.status(500).send({ status: 'error', error: 'Ha ocurrido un error' })
  res.send({ status: 'success', payload: users })
}

const getUserById = async (req, res) => {
  const { uid } = req.params
  const result = await usersService.getUserBy({ _id: uid })
  if (!result) return res.status(500).send({ status: 'error', error: 'Ha ocurrido un error' })
  res.send({ status: 'success', payload: result })
}

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age
    } = req.body
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      age
    }
    const result = await usersService.createUser(newUser)
    res.send({ status: 'success', payload: result })
  } catch (err) {
    req.logger.error({ error: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { uid, data } = req.body
    const result = await usersService.updateUser({ _id: uid }, data)
    res.send({ status: 'success', payload: result })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(400).json({ error: 'Ha ocurrido un error', err })
  }
}

const updateUserRole = async (req, res) => {
  const { uid } = req.params
  const user = await usersService.getUserBy({ _id: uid })
  const userRole = user.role
  if (userRole === 'user') {
    const result = await usersService.updateUser({ _id: uid }, { role: 'admin' })
    return res.send({ status: 'success', result })
  }
  if (userRole === 'admin') {
    const result = await usersService.updateUser({ _id: uid }, { role: 'user' })
    return res.send({ status: 'success', result })
  }
}

const resetPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Completa el campo de correo electrónico.' })
  }

  try {
    const user = await usersService.getUserByEmail({ email })
    if (!user) {
      return res.status(200).json({ message: 'Correo electrónico de recuperación enviado. ¡Revisa tu bandeja de entrada!' })
    }
    user.resetPasswordCode = null
    const token = generateToken({ email: user.email })
    const hashedToken = createHash(token)
    await usersService.updateUser({ _id: user._id }, { resetPasswordCode: hashedToken })

    const resetLink = `http://localhost:8080/reset-password/${token}/${user._id}`

    const payload = {
      name: user.firstName,
      resetLink
    }

    const mailingService = new MailingService()
    await mailingService.sendMail(user.email, DTemplates.RESET_PASSWORD, payload)
      .then(result => {
        console.log('Email sent:', result.response)
      })
      .then(res.redirect('/reset-email-sent'))
      .catch(error => {
        console.error('Error sending email:', error)
        return res.status(500).json({ message: 'Error enviando correo electrónico.' })
      })
  } catch (err) {
    req.logger.error(err.message)
    return res.status(500).json({ error: 'Unexpected error ocurred', err })
  }
}

const verifyResetToken = async (req, res) => {
  try {
    const { code, uid } = req.params
    if (!code || !uid) return res.status(400).json({ status: 'error', error: 'Invalid request' })
    const user = await usersService.getUserBy(uid)
    if (!user) return res.status(400).json({ status: 'error', error: 'Invalid request' })
    const isNotValidCode = !validateCode(code, user)
    if (isNotValidCode) return res.status(400).json({ status: 'error', error: 'Invalid request' })
    res.redirect(`/reset-password/${code}/${uid}`)
  } catch (err) {
    req.logger.error(err)
    return res.status(500).json({ status: 'error', error: 'Something went wrong' })
  }
}

const setNewPass = async (req, res) => {
  try {
    const { code, uid } = req.params
    const { newPassword, confirmPassword } = req.body
    if (!code || !uid) return res.status(400).json({ status: 'error', error: 'Invalid request' })
    if (newPassword !== confirmPassword) return res.status(400).send({ error: 'Las contraseñas no coinciden' })

    const user = await usersService.getUserBy(uid)
    const isPrevPass = validatePassword(newPassword, user)
    if (isPrevPass) return res.send('You cannot use the last password as the new one')
    const isValidToken = verifyToken(code)
    if (!isValidToken) {
      res.status(400).send({ status: 'error', error: 'An error ocurred verifying the data' })
    }
    const hashedPassword = createHash(newPassword)
    await usersService.updateUser({ _id: user._id }, { password: hashedPassword })
    await usersService.updateUser({ _id: user._id }, { resetPasswordCode: null })
    res.status(200).send({ status: 'success', message: 'Password successfully restored' })
  } catch (err) {
    req.logger.error(err)
    return res.status(500).send({ status: 'error', error: 'Unexpected error ocurred', err })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { uid } = req.body
    const result = await usersService.deleteUser({ _id: uid })
    res.send({ status: 'success', message: 'User deleted', payload: result })
  } catch (err) {
    req.logger.error({ error: err.message, message: 'User not found' })
    res.status(404).send({ status: 'error', error: 'User not found' })
  }
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  resetPassword,
  verifyResetToken,
  setNewPass,
  deleteUser
}
