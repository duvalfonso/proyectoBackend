import { Router } from 'express'
import MonProductManager from '../dao/mongo/managers/products.js'
import uploader from '../services/uploader.js'

const router = Router()
const productsService = new MonProductManager()

router.get('/', async (req, res) => {
  const products = await productsService.getProductsList()
  res.send({ status: 'success', payload: products })
})

router.post('/', uploader.array('thumbnail'), async (req, res) => {
  const { title, description, price, code, stock } = req.body
  if (!title || !description || !price || !code || !stock) {
    return res
      .status(400)
      .send({ status: 'error', error: 'Incomplete values' })
  }

  const newProduct = {
    title,
    description,
    price,
    code,
    stock
  }
  const thumbnail = req.files.map(
    (file) =>
      `${req.protocol}:://${req.hostname}:${process.env.PORT || 8080}/img/${file.filename}`

  )
  if (!thumbnail) {
    newProduct.thumbnail = []
  }
  newProduct.thumbnail = thumbnail
  const result = await productsService.createProduct(newProduct)
  res.send({ status: 'success', payload: result._id })
})

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid
  const { title, description, price, code, stock } = req.body

  const updatedProduct = {
    title,
    description,
    price,
    code,
    stock
  }

  const product = await productsService.getProductById({ _id: pid })
  if (!product) {
    return res
      .status(400)
      .send({ status: 'error', error: 'Product not found' })
  }
  await productsService.updateProduct(pid, updatedProduct)
  res.send({ status: 'success', message: 'Product updated' })
})

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid
  const result = await productsService.deleteProduct(pid)
  console.log(result)
  res.send({ status: 'success', message: 'Product deleted' })
})

export default router
