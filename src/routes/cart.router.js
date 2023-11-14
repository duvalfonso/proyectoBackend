import express from 'express'
import CartManager from '../dao/fileSystem/managers/cartManager.js'
import ProductManager from '../dao/fileSystem/managers/productManager.js'

const app = express()
app.use(express.json())

const router = express.Router()
const cartManager = new CartManager('./files/carts.json')
const productManager = new ProductManager('./files/products.json')

async function initializeCartManager () {
  await cartManager.initialize()
}

async function initializeProductManager () {
  await productManager.initialize()
}

initializeCartManager()
initializeProductManager()

router.get('/', async (req, res) => {
  const carts = await cartManager.getCarts()
  res.send({ status: 'success', payload: carts })
})

router.get('/:cid', async (req, res) => {
  const cid = Number(req.params.cid)
  if (isNaN(cid)) return res.status(400).send({ error: 'Must use only numbers to search by id!' })
  try {
    const cart = await cartManager.getCart(cid)
    res.send({ status: 'success', payload: cart })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const cart = await cartManager.addNewCart()
  res.send({ status: 'success', payload: cart })
})

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid)
  const pid = Number(req.params.pid)
  try {
    const cart = await cartManager.getCart(cid)
    const product = await productManager.getProductById(pid)

    await cartManager.addProduct(cid, product.id)
    res.send({ status: 'success', payload: cart })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
