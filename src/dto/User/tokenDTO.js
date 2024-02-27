export default class UserTokenDTO {
  static getFrom = user => {
    return {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      cart: user.cart
    }
  }
}
