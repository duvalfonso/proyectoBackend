import BaseRouter from './Router.js'
import cartsController from '../../controllers/carts.controller.js'

export default class CartsRouter extends BaseRouter {
  init () {
    this.get('/', ['admin'], cartsController.getCarts)
    this.post('/', ['user'], cartsController.createCart)
    this.get('/:cid', ['user'], cartsController.getCartById)
    this.post('/:cid/product/:pid', ['PUBLIC', 'user', 'premium', 'admin', 'superadmin'], cartsController.addProduct)
    this.put('/:cid/product/:pid', ['user'], cartsController.updateQuantity)
    this.put('/:cid', ['admin'], cartsController.updateListOfProducts)
    this.delete('/:cid/product/:pid', ['user'], cartsController.removeProduct)
    this.delete('/:cid', ['user'], cartsController.clearCart)
  }
}
