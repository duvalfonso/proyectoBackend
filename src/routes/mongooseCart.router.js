import { Router } from 'express'
import MonCartManager from '../dao/mongo/managers/carts.js'
import CartModel from '../dao/mongo/models/cart.js'

const router = Router()
const cartsService = new MonCartManager()

router.get('/', async (req, res) => {
  const carts = await CartModel.find()
  res.send({ status: 'success', payload: carts })
})

router.post('/', async (req, res) => {
  const newCart = await cartsService.createCart()
  res.send({ status: 'success', payload: newCart._id })
})

router.get('/:cid', async (req, res) => {
  const cid = req.params.cid
  const cart = await CartModel.findOne({ _id: cid })
  if (!cart) {
    return res.status(400).send({ status: 'error', error: `Cart with id: ${cid} not found!` })
  }
  res.send({ status: 'success', payload: cart })
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { pid, cid } = req.params
    const quantity = Number(req.body.quantity)

    const result = await cartsService.addProduct(cid, pid, quantity)

    res.status(200).json({
      status: 'success',
      msg: 'Process successful',
      cartData: result
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

router.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const quantity = Number(req.body.quantity)
  try {
    const updatedQuantity = await cartsService.updateQuantity(cid, pid, quantity)
    res.json({
      status: 'success',
      message: 'Quantity updated',
      cartData: updatedQuantity
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { pid, cid } = req.params
    const result = await cartsService.removeProduct(cid, pid)
    res.status(201).json({
      status: 'success',
      msg: 'Product removed from cart',
      cartData: result
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartsService.clearCart(cid)
    res.json({
      status: 'success',
      msg: `Cart with id ${cid} is now empty!`,
      payload: result
    })
  } catch (err) {
    console.error(err)
  }
})

export default router
