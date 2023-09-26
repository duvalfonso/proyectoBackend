export default class ProductManager {
  constructor () {
    this.products = []
  }

  addProduct (title, description, price, thumbnail, code, stock) {
    const existingProduct = this.products.find(product => product.code === code)
    if (existingProduct) {
      console.log('A product with the same five-digit code already exists!')
    }

    const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1
    const newProduct = { id, title, description, price, thumbnail, code, stock }
    this.products.push(newProduct)
    console.log('Product added successfully', newProduct)
  }

  getProductsList () {
    return this.products
  }

  getProductById (id) {
    const product = this.products.find(product => product.id === id)
    if (!product) {
      console.error('Product not found')
    }
    return product
  }
}
