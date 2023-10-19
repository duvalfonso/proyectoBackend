import fs from 'fs'

export default class CartManager {
  constructor (path) {
    this.path = path
  }

  async initialize () {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8')
      this.carts = JSON.parse(data)
    } catch (err) {
      console.error('Error trying to initialize carts.')
      this.carts = []
    }
  }

  async saveData (carts) {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, '\t'),
        'utf8'
      )
    } catch (err) {
      console.error('Error saving data', err)
    }
  }

  async addNewCart () {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf8')
        const carts = JSON.parse(data)

        const id = carts[carts.length - 1].id + 1
        const cart = { id, products: [] }
        carts.push(cart)

        this.saveData(carts)
        return cart
      } else {
        const cart = { id: 1, products: [] }
        const carts = [cart]
        this.saveData(carts)
        return cart
      }
    } catch (err) {
      console.error(err)
    }
  }

  async getCart (id) {
    const cart = await this.carts.find(cart => cart.id === id)
    if (!cart) {
      throw new Error(`Cart with id: ${id} not found!`)
    }
    return cart
  }

  async getCarts () {
    return this.carts
  }

  async addProduct (cid, pid) {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8')
      const carts = JSON.parse(data)
      const cartIndex = carts.findIndex(cart => cart.id === cid)

      if (cartIndex === -1) return null

      const cart = carts[cartIndex].products

      const existingProduct = cart.find(p => p.product === pid)
      if (!existingProduct) {
        cart.push({ product: pid, quantity: 1 })
        this.saveData(carts)
        return cart
      } else {
        const cartIndex = cart.findIndex(p => p.product === pid)
        cart[cartIndex].quantity += 1
        this.saveData(carts)
        return cart
      }
    } catch (err) {
      console.error(err.message)
    }
  }
}
