import productModel from '../models/product.js'

export default class DaoProductsManager {
  getProductsList = () => {
    return productModel.find().lean()
  }

  getProductById = (id) => {
    return productModel.findOne(id).lean()
  }

  getProductStock = (id) => {
    const product = productModel.findById(id)
    return product.stock
  }

  createProduct = (product) => {
    return productModel.create(product)
  }

  updateProduct = (id, product) => {
    return productModel.updateOne({ _id: id }, { $set: product })
  }

  updateProductStock = (productId, newStock) => {
    return this.updateProduct(productId, { stock: newStock })
  }

  deleteProduct = (id) => {
    return productModel.deleteOne({ _id: id })
  }
}
