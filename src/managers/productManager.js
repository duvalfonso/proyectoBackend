import fs from 'fs'

export default class ProductManager {
  constructor (path) {
    this.path = path
    this.products = []
  }

  async initialize () {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      this.products = JSON.parse(data)
    } catch (error) {
      console.error('Error initializing product data:', error)
      this.products = []
    }
  }

  async saveData () {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, '\t'),
        'utf-8'
      )
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  async addProduct (title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) return
    const existingProduct = this.products.find(product => product.code === code)
    if (existingProduct) {
      console.log('A product with the same five-digit code: already exists!')
      return
    }

    const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1
    const newProduct = { id, title, description, price, thumbnail, code, stock }
    this.products.push(newProduct)
    await this.saveData().then(console.log('Product added successfully:', newProduct))
  }

  async getProductsList () {
    console.log('Products List:', this.products)
    return this.products
  }

  async getProductById (id) {
    const product = this.products.find(product => product.id === id)
    if (!product) {
      throw new Error(`Product with id: ${id} not found!`)
    }
    console.log(product)
    return product
  }

  async updateProduct (id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    const { id: _, ...newData } = updatedProduct

    this.products[index] = { ...this.products[index], ...newData }
    await this.saveData()
  }

  async deleteProduct (id) {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    this.products.splice(index, 1)
    await this.saveData()
    console.log(`Product with id: ${id}, succesfully deleted`)
  }
}
