export default class CartRepository {
  constructor (dao) {
    this.dao = dao
  }

  getCarts = (params) => {
    return this.dao.getCarts(params)
  }

  getCartById = (id) => {
    return this.dao.getCartById(id)
  }

  createCart = () => {
    return this.dao.createCart()
  }

  addProduct = async (cartId, productId, quantity) => {
    return await this.dao.addProduct(cartId, productId, quantity)
  }

  updateQuantity = (id, data) => {
    return this.dao.updateQuantity(id, data)
  }

  clearCart = (id) => {
    return this.dao.clearCart(id)
  }

  deleteCart = (id) => {
    return this.dao.delete(id)
  }
}
