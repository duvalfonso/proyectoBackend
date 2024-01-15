import productModel from '../models/product.js'

export default class DaoProductsManager {
  getProductsList = () => {
    return productModel.find().lean()
  }

  getProductById = (id) => {
    return productModel.findOne(id).lean()
  }

  createProduct = (product) => {
    return productModel.create(product)
  }

  updateProduct = (id, product) => {
    return productModel.updateOne({ _id: id }, { $set: product })
  }

  deleteProduct = (id) => {
    return productModel.deleteOne({ _id: id })
  }
}
