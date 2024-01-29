import { usersService } from '../services/repositories.js'
import { createHash, isValidPassword } from '../utils.js'
import jwt from 'jsonwebtoken'
import UserTokenDTO from '../dto/User/tokenDTO.js'

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' })
    const exists = await usersService.getUserByEmail(email)
    if (exists) return res.status(400).send({ status: 'error', error: 'User already exists' })
    const hashedPassword = await createHash(password)
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword
    }
    const result = await usersService.createUser(user)
    console.log(result)
    res.send({ status: 'success', payload: result._id })
  } catch (err) {
    console.error(err)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' })
  const user = await usersService.getUserByEmail(email)
  if (!user) return res.status(404).send({ status: 'error', error: "User doesn't exists" })
  const validPass = isValidPassword(user, password)
  if (!validPass) return res.status(400).send({ status: 'error', error: 'Incorrect password' })
  const userDTO = UserTokenDTO.getFrom(user)
  const token = jwt.sign(userDTO, 'jwtSecret', { expiresIn: '5m' })
  res.cookie('authToken', token, { maxAge: 3600 }).send({ status: 'success', message: 'Logged in' })
}

const current = async (req, res) => {
  const cookie = res.cookie.authToken
  const user = jwt.verify(cookie, 'jwtSecret')
  if (user) return res.send({ status: 'success', payload: user })
}

const unprotectedLogin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' })
  const user = await usersService.getUserByEmail(email)
  if (!user) return res.status(404).send({ status: 'error', error: "User doesn't exists" })
  const validPass = isValidPassword(user, password)
  if (!validPass) return res.status(400).send({ status: 'error', error: 'Incorrect password' })
  const token = jwt.sign(user, 'jwtSecret', { expiresIn: '5m' })
  res.cookie('unprotectedCookie', token, { maxAge: 3600 }).send({ status: 'success', message: 'Unprotected Logged in' })
}

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies.unprotectedCookie
  const user = jwt.verify(cookie, 'jwtSecret')
  if (user) return res.send({ status: 'success', payload: user })
}

export default {
  current,
  login,
  register,
  unprotectedLogin,
  unprotectedCurrent
}
