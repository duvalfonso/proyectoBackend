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
}
