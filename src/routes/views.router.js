import express from 'express'
import ProductManager from '../managers/productManager.js'

const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}
initializeProductManager()

const router = express.Router()

router.get('/', async (req, res) => {
  const result = await productManager.getProductsList()
  res.render('index', {
    result
  })
})

router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status } = req.body
  try {
    const newProduct = await productManager.addProduct(title, description, price, thumbnail, code, stock, status)

    req.io.emit('update-list', newProduct)
    res.send({ status: 'success', payload: newProduct })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await productManager.deleteProduct(id)
    req.io.emit('remove-product', id)
    res.json({ message: 'Product succesfully deleted.' })
    // res.render('index', { id })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
