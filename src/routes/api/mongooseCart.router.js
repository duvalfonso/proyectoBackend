import { Router } from 'express'
import cartsController from '../../controllers/carts.controller.js'

const router = Router()

router.get('/', cartsController.getCarts)

router.post('/', cartsController.createCart)

router.get('/:cid', cartsController.getCartById)

router.post('/:cid/product/:pid', cartsController.addProduct)

router.put('/:cid/product/:pid', cartsController.updateQuantity)

router.delete('/:cid/product/:pid', cartsController.removeProduct)

router.delete('/:cid', cartsController.clearCart)

export default router
