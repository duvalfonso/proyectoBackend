export default class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  getProducts = () => {
    return this.dao.getProducts()
  }

  getProductBy = (params) => {
    return this.dao.getProductBy(params)
  }

  createProduct = (product) => {
    return this.dao.createProduct(product)
  }

  updateProduct = (id, product) => {
    return this.dao.updateProduct(id, product)
  }

  deleteProduct = (id) => {
    return this.dao.deleteProduct(id)
  }
}
