import userModel from '../models/user.js'

export default class UsersManager {
  getUsers = (params) => {
    return userModel.find(params).lean()
  }

  getUserById = (params) => {
    return userModel.findById(params).lean()
  }

  getUserByEmail = (email) => {
    return userModel.findOne(email).lean()
  }

  createUser = (user) => {
    return userModel.create(user)
  }

  updateUser = (userId, user) => {
    return userModel.findByIdAndUpdate(userId, { $set: user })
  }

  deleteUser = (userId) => {
    return userModel.findByIdAndDelete(userId)
  }
}
