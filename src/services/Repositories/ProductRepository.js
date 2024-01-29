export default class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  getProducts = () => {
    return this.dao.getProducts()
  }

  getProductById = (params) => {
    return this.dao.getProductById(params)
  }

  getProductStock = (id) => {
    return this.dao.getProductStock(id)
  }

  createProduct = (product) => {
    return this.dao.createProduct(product)
  }

  updateProduct = (id, product) => {
    return this.dao.updateProduct(id, product)
  }

  updateProductStock = (id, newStock) => {
    return this.dao.updateProductStock(id, newStock)
  }

  deleteProduct = (id) => {
    return this.dao.deleteProduct(id)
  }
}
