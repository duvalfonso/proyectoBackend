export default class UserInsertDTO {
  static getFrom = (user) => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: user.password,
      cart: user.cart
    }
  }
}
