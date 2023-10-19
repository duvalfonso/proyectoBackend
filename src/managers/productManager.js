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

  async addProduct (title, description, price, thumbnail, code, stock, status) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('All the fields are required!')
    }

    const existingProduct = this.products.find(product => product.code === code)
    if (existingProduct) {
      throw new Error('A product with the same five-digit code: already exists!')
    }

    const id = this.products.length > 0
      ? this.products[this.products.length - 1].id + 1
      : 1

    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: typeof status !== 'undefined' ? status : true
    }
    this.products.push(newProduct)
    await this.saveData()
    console.log('Product added successfully:', newProduct)
    return newProduct
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
      throw new Error('Product not found.')
    }

    if (updatedProduct.id && updatedProduct.id !== id) {
      throw new Error('The ID cannot be changed!')
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
