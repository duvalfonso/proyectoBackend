import { Router } from 'express'
import DaoProductsManager from '../../dao/mongo/managers/products.js'
import uploader from '../../services/uploader.js'
import { buildResponsePaginated } from '../../utils.js'

import ProductModel from '../../dao/mongo/models/product.js'

const router = Router()
const productsService = new DaoProductsManager()

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query
  const criteria = {}
  const options = { limit, page }
  if (sort) {
    options.sort = sort
      ? sort === 'asc'
        ? { price: 1 }
        : sort === 'desc'
          ? { price: -1 }
          : null
      : null
  }
  if (search) {
    criteria.category = search
  }
  const products = await ProductModel.paginate(criteria, options)
  const urlBase = 'http://localhost:8080/api/monproducts'
  const data = buildResponsePaginated({ ...products }, urlBase)
  res.status(200).send({ data })
})

router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid
    const product = await productsService.getProductById({ _id: pid })
    res.send({ status: 'success', payload: product })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(400).send({ status: 'error', error: err.message })
  }
})

router.post('/', uploader.array('thumbnail'), async (req, res) => {
  const { title, category, description, price, code, stock, status } = req.body
  if (!title || !category || !description || !price || !code || !stock) {
    return res
      .status(400)
      .send({ status: 'error', error: 'Incomplete values' })
  }

  const newProduct = {
    title,
    category,
    description,
    price,
    code,
    stock,
    status
  }
  const thumbnail = req.files.map(
    (file) =>
      `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/img/${file.filename}`

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
  const { title, category, description, price, code, stock, status } = req.body

  const updatedProduct = {
    title,
    category,
    description,
    price,
    code,
    stock,
    status
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
