import DTemplates from '../constants/DTemplates.js'
import MailingService from '../services/MailingService.js'
import { generateToken } from '../services/auth.js'

const register = async (req, res) => {
  const mailingService = new MailingService()
  console.log(req.user)
  try {
    const result = await mailingService.sendMail(req.user.email, DTemplates.WELCOME, { user: req.user })
    console.log(result)
    res.sendSuccess('Registered')
  } catch (error) {
    console.error(error)
    res.sendInternalError(error)
  }
}

const login = (req, res) => {
  try {
    const token = generateToken(req.user)
    res.cookie('authToken', token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true
    }).sendSuccess('Logged In')
  } catch (err) {
    console.error(err)
  }
}

const logout = (req, res) => {
  res.clearCookie('authToken')
  res.sendSuccess('Logged out successfully')
}

export default {
  login,
  register,
  logout
}
