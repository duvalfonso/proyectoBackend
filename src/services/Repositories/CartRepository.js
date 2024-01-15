export default class CartRepository {
  constructor (dao) {
    this.dao = dao
  }

  getCarts = () => {
    return this.dao.getCarts()
  }

  getCartBy = (params) => {
    return this.dao.getCartBy(params)
  }

  createCart = () => {
    return this.dao.createCart()
  }

  updateCart = (id, data) => {
    return this.dao.update(id, data)
  }

  clearCart = (id) => {
    return this.dao.clearCart(id)
  }

  deleteCart = (id) => {
    return this.dao.delete(id)
  }
}
