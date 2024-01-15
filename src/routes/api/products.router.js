import express from 'express'
import ProductManager from '../../dao/fileSystem/managers/productManager.js'

const app = express()
app.use(express.json())

const router = express.Router()
const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}

initializeProductManager()

router.get('/', async (req, res) => {
  const limit = Number(req.query.limit)
  const products = await productManager.getProductsList()

  if (!limit) {
    res.send({ status: 'success', payload: products })
    return
  }

  const limitResult = products.slice(0, limit)
  res.send({ status: 'success', payload: limitResult })
})

router.get('/:pid', async (req, res) => {
  const pid = Number(req.params.pid)
  try {
    const product = await productManager.getProductById(pid)
    res.send({ status: 'success', payload: product })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status } = req.body
  try {
    const result = await productManager.addProduct(title, description, price, thumbnail, code, stock, status)
    res.send({ status: 'success', payload: result })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const updatedProduct = req.body
  try {
    await productManager.updateProduct(id, updatedProduct)
    res.send({ message: 'Product succesfully updated' })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await productManager.deleteProduct(id)
    res.json({ message: 'Product succesfully deleted.' })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
