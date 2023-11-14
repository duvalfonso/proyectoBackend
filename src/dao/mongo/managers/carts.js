import cartModel from '../models/cart.js'
import MonProductManager from './products.js'
const productsService = new MonProductManager()

export default class MonCartManager {
  getCarts = async () => {
    return await cartModel.find().lean()
  }

  getCartById = async (id) => {
    return await cartModel.findOne(id).lean()
  }

  createCart = async () => {
    return await cartModel.create({})
  }

  addProduct = async (cartId, productId, quantity) => {
    const product = await productsService.getProductById({ _id: productId })

    if (!product) {
      throw new Error(`Product with id: ${productId} not found!`)
    }

    const cart = await cartModel.findOne({ _id: cartId })

    if (!cart) {
      throw new Error(`Cart with id: ${cartId} not found!`)
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId)

    if (existingItem) {
      if (quantity > 0) {
        existingItem.quantity += quantity
        existingItem.total = existingItem.quantity * existingItem.price
      } else {
        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
      }
    } else if (quantity > 0) {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        total: product.price * quantity
      })
    }

    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0)

    await cart.save()

    return {
      items: cart.items,
      subTotal: cart.subTotal
    }
  }

  removeProduct = async (cartId, productId) => {
    const cart = await cartModel.findOne({ _id: cartId })

    if (!cart) {
      throw new Error(`Cart with id: ${cartId} not found!`)
    }

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId)

    if (productIndex !== -1) {
      cart.items.splice(productIndex, 1)
      cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0)

      await cart.save()
    }
    return {
      items: cart.items,
      subTotal: cart.subTotal
    }
  }
}
