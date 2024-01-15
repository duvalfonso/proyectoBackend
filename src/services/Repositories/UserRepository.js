export default class UserRepository {
  constructor (dao) {
    this.dao = dao
  }

  getUsers = () => {
    return this.dao.getUsers()
  }

  getUserBy = (params) => {
    return this.dao.getUserBy(params)
  }

  createUser = (user) => {
    return this.dao.createUser(user)
  }

  updateUser = (id, data) => {
    return this.dao.updateUser(id, data)
  }

  deleteUser = (id) => {
    return this.dao.delete(id)
  }
}
