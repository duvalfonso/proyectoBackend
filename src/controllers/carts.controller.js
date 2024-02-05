import { cartsService } from '../services/repositories.js'

const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts()
    res.send({ status: 'success', payload: carts })
  } catch (err) {
    req.logger.error(err)
  }
}

const createCart = async (req, res) => {
  const newCart = await cartsService.createCart()
  res.send({ status: 'success', payload: newCart })
}

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params

    const result = await cartsService.getCartById(cid)

    res.status(200).json({
      status: 'success',
      msg: 'Process successful',
      cartData: result
    })
  } catch (err) {
    req.logger.error(err)
    res.status(400).json({ error: err.message })
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
  removeProduct,
  clearCart
}
