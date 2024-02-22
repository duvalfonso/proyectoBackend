export default class UserTokenDTO {
  static getFrom = user => {
    return {
      id: user._id,
      name: user.name,
      role: user.role,
      cart: user.cart
    }
  }
}
