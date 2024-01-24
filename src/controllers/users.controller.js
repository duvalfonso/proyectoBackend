import { usersService } from '../services/repositories.js'

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
    console.error({ error: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { uid, data } = req.body
    const result = await usersService.updateUser({ _id: uid }, data)
    res.send({ status: 'success', payload: result })
  } catch (err) {
    console.error({ error: err.message })
    res.status(400).json({ error: 'Ha ocurrido un error', err })
  }
}

const deleteUser = async (req, res) => {
  const { uid } = req.body
  const result = await usersService.deleteUser({ _id: uid })
  res.send({ status: 'success', message: 'User deleted', payload: result })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
