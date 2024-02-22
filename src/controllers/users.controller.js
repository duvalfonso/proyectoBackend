import { usersService } from '../services/repositories.js'
import { generateToken } from '../services/auth.js'
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

const resetPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Completa el campo de correo electrónico.' })
  }

  console.log(email)
  try {
    const user = await usersService.getUserByEmail({ email })
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado.' })
    }
    user.resetPasswordCode = null
    const token = generateToken({ email: user.email })
    const resetLink = `http://localhost:8080/api/users/reset-password?code=${token}&userId=${user._id}`
    user.resetPasswordCode = token

    const payload = {
      name: user.name,
      resetLink
    }

    const mailingService = new MailingService()
    await mailingService.sendMail(user.email, DTemplates.RESET_PASSWORD, payload)
      .then(result => {
        console.log('Email sent:', result.response)
        res.json({ message: 'Correo electrónico de recuperación enviado. ¡Revisa tu bandeja de entrada!' })
      })
      .catch(error => {
        console.error('Error sending email:', error)
        return res.status(500).json({ message: 'Error enviando correo electrónico.' })
      })
  } catch (err) {
    req.logger.error(err.message)
    return res.status(500).json({ error: 'Unexpected error ocurred', err })
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
  resetPassword,
  deleteUser
}
