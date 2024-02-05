import { Router } from 'express'
import DaoCartsManager from '../../dao/mongo/managers/carts.js'
import cartsController from '../../controllers/carts.controller.js'

const router = Router()
const cartsService = new DaoCartsManager()

router.get('/', cartsController.getCarts)

router.post('/', cartsController.createCart)

router.get('/:cid', cartsController.getCartById)

router.post('/:cid/product/:pid', cartsController.addProduct)

router.put('/:cid/product/:pid', cartsController.updateQuantity)

// router.put('/:cid/product/:pid', async (req, res) => {
//   const { cid, pid } = req.params
//   const quantity = Number(req.body.quantity)
//   try {
//     const updatedQuantity = await cartsService.updateQuantity(cid, pid, quantity)
//     res.json({
//       status: 'success',
//       message: 'Quantity updated',
//       cartData: updatedQuantity
//     })
//   } catch (err) {
//     console.error(err)
//     res.status(400).json({ error: err.message })
//   }
// })

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
    req.logger.error(err)
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
    req.logger.error(err)
  }
})

export default router
