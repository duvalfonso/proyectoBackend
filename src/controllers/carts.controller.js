import { cartsService } from '../services/repositories.js'

const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts()
    res.sendSuccessWithPayload(carts)
  } catch (err) {
    req.logger.error(err)
  }
}

const createCart = async (req, res) => {
  const newCart = await cartsService.createCart()
  res.sendSuccessWithPayload(newCart)
}

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params

    const result = await cartsService.getCartById(cid)

    res.sendSuccessWithPayload(result)
  } catch (err) {
    req.logger.error(err)
    res.sendUnathorized(err)
  }
}

const addProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const { quantity } = req.body

    const result = await cartsService.addProduct(cid, pid, quantity)

    res.status(200).json({
      status: 'success',
      msg: 'Proccess successful',
      cartData: result
    })
  } catch (err) {
    req.logger.error(err)
  }
}

const updateQuantity = async (req, res) => {
  const { cid, pid } = req.params
  const quantity = req.body.quantity
  try {
    const updatedQuantity = await cartsService.updateQuantity(cid, pid, quantity)
    res.json({
      status: 'success',
      message: 'Quantity updated',
      cartData: updatedQuantity
    })
  } catch (err) {
    req.logger.error(err)
    res.status(400).json({ error: err.message })
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
    res.status(201).json({
      status: 'success',
      msg: 'Product removed from cart',
      cartData: result
    })
  } catch (err) {
    req.logger.error(err)
    res.status(400).json({ error: err.message })
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
