import cartModel from '../models/cart.js'
import MonProductManager from './products.js'
const productsService = new MonProductManager()

export default class MonCartManager {
  getCarts = async () => {
    return await cartModel.find().lean()
  }

  getCartById = async (id) => {
    return await cartModel.findOne({ _id: id }).lean()
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

  updateQuantity = async (cartId, productId, quantity) => {
    const cart = await cartModel.findOne({ _id: cartId })
    if (!cart) { throw new Error(`Cart with id: ${cartId} not found!`) }

    const productInCart = cart.items.find(item => item.productId.toString() === productId)
    if (!productInCart) { throw new Error(`Product with id: ${productId} not found!`) }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId)
    }

    if (quantity > 0) {
      productInCart.quantity = quantity
      productInCart.total = productInCart.quantity * productInCart.price
    }

    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0)

    if (quantity < 0) { throw new Error(`Quantity should be only positive numbers to modify, or 0 to delete the product from the cart, instead received ${quantity}`) }

    await cart.save()

    return {
      items: cart.items,
      subTotal: cart.subTotal
    }
  }

  updateListOfProducts = async (cartId, productsArray) => {
    const cart = await cartModel.findOne({ _id: cartId })
    if (!cart) { throw new Error(`Cart with id: ${cartId} not found!`) }

    cart.items = productsArray
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

  clearCart = async (cartId) => {
    const cart = await cartModel.findOne({ _id: cartId })

    if (!cart) {
      throw new Error(`Cart with id: ${cartId} not found!`)
    }

    cart.items = []
    cart.subTotal = 0
    await cart.save()
    return cart
  }
}
