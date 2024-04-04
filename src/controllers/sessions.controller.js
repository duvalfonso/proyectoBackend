import DTemplates from '../constants/DTemplates.js'
import MailingService from '../services/MailingService.js'
import { generateToken, verifyToken } from '../services/auth.js'

const register = async (req, res) => {
  const mailingService = new MailingService()
  try {
    const result = await mailingService.sendMail(req.user.email, DTemplates.WELCOME, { user: req.user })
    const user = req.user
    console.log(result)
    res.sendSuccessWithPayload(user)
  } catch (error) {
    console.error(error)
    res.sendInternalError(error)
  }
}

const login = (req, res) => {
  try {
    const user = req.user
    const token = generateToken(user)
    res.cookie('authToken', token, {
      maxAge: 1000 * 3600 * 1,
      httpOnly: true
    }).send({ status: 'success', message: 'Logged In', payload: user })
  } catch (err) {
    console.error(err)
  }
}
const current = async (req, res) => {
  const cookie = req.cookies.authToken
  const user = verifyToken(cookie)
  if (user) return res.sendSuccessWithPayload(user)
}

const logout = (req, res) => {
  res.clearCookie('authToken')
  res.sendSuccess('Logged out successfully')
}

export default {
  login,
  register,
  current,
  logout
}
