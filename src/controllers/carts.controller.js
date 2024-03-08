import { cartsService, productsService } from '../services/repositories.js'

const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts()
    res.sendSuccessWithPayload(carts)
  } catch (err) {
    req.logger.error(err)
  }
}

const createCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'error', error: 'Must be logged in' })
    const newCart = await cartsService.createCart()
    res.sendSuccessWithPayload(newCart)
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ status: 'error', error: 'Unexpected error ocurred', err })
  }
}

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params

    const cart = await cartsService.getCartById(cid)
    if (!cart) return res.status(404).json({ status: 'error', error: 'Not found' })
    res.sendSuccessWithPayload(cart)
  } catch (err) {
    req.logger.error(err)
    res.sendUnathorized(err)
  }
}

const addProduct = async (req, res) => {
  try {
    const uid = req.user.id
    const { pid, cid } = req.params
    const { quantity } = req.body
    const product = await productsService.getProductById(pid)

    if (uid === product.owner) return res.status(403).send({ status: 'error', error: 'Forbidden' })
    const result = await cartsService.addProduct(cid, pid, quantity)

    res.status(200).json({
      status: 'success',
      msg: 'Proccess successful',
      cartData: result
    })
  } catch (err) {
    req.logger.error(err)
    return res.status(400).send({ error: 'Bad request' })
  }
}

const updateQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const quantity = req.body.quantity
    if (!cid || !pid || !quantity) return res.status(400).json({ status: 'error', error: 'Missing params' })
    const cart = await cartsService.getCartById(cid)
    const product = await productsService.getProductById(pid)
    if (!cart || !product) return res.status(404).json({ status: 'error', error: 'Cart or product not found, double check the ids' })

    const updatedQuantity = await cartsService.updateQuantity(cid, pid, quantity)
    res.json({
      status: 'success',
      message: 'Quantity updated',
      cartData: updatedQuantity
    })
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ error: err.message })
  }
}

const updateListOfProducts = async (req, res) => {
  try {
    const { cid } = req.params
    const { productsArray } = req.body
    const result = await cartsService.updateListOfProducts(cid, productsArray)
    res.status(200).send({
      status: 'success',
      updatedCart: result
    })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(500).send({ status: 'error', error: err })
  }
}

const removeProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const result = await cartsService.removeProduct(cid, pid)
    res.status(200).json({
      status: 'success',
      msg: 'Product removed from cart',
      cartData: result
    })
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ error: err.message })
  }
}

const clearCart = async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartsService.clearCart(cid)
    res.json({
      status: 'success',
      msg: `Cart with id ${cid} is now empty!`,
      payload: result
    })
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ status: 'error', err })
  }
}

export default {
  getCarts,
  createCart,
  getCartById,
  addProduct,
  updateQuantity,
  updateListOfProducts,
  removeProduct,
  clearCart
}
