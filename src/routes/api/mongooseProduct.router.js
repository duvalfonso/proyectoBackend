import { Router } from 'express'
import DaoProductsManager from '../../dao/mongo/managers/products.js'
import uploader from '../../services/uploader.js'
import { buildResponsePaginated } from '../../utils.js'
import { passportCall } from '../../services/auth.js'

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
    if (!product) return res.status(404).json({ status: 'error', error: `Producto con id: ${pid} no encontrado` })
    res.send({ status: 'success', payload: product })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(500).send({ status: 'error', error: err.message })
  }
})

router.post('/', passportCall('jwt', { strategyType: 'jwt' }), uploader.array('thumbnail'), async (req, res) => {
  try {
    if (!req.user) return res.status(401).send({ status: 'error', error: 'Not authenticated. Must login before trying again' })
    const userRole = req.user.role
    const authorizedRole = 'premium'
    if (userRole !== authorizedRole) return res.status(403).send({ status: 'error', error: 'Forbidden' })
    const owner = req.user.id
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
      status,
      owner
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
    res.status(201).send({ status: 'success', payload: result._id })
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ status: 'error', error: err })
  }
})

router.put('/:pid', async (req, res) => {
  try {
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
    res.send({ status: 'success', message: 'Product updated', payload: updatedProduct })
  } catch (err) {
    req.logger.error(err)
    res.status(500).json({ status: 'error', error: 'Unexpected error ocurred', err })
  }
})

router.delete('/:pid', passportCall('jwt', { strategyType: 'jwt' }), async (req, res) => {
  try {
    if (!req.user) return res.status(401).send({ error: 'Not authenticated. Must login before trying again' })
    const userRole = req.user.role
    const authorizedRoles = ['admin', 'premium']
    if (!userRole.includes(authorizedRoles)) return res.status(403).send({ status: 'error', error: 'Forbidden' })
    const userId = req.user.id
    const pid = req.params.pid
    const product = await productsService.getProductById(pid)
    if (!product) return res.status(404).json({ status: 'error', error: 'Product not found' })
    const productOwner = product.owner

    if (userId !== productOwner) return res.status(403).send({ status: 'error', error: 'Forbidden' })
    const result = await productsService.deleteProduct(pid)
    console.log(result)
    res.send({ status: 'success', message: 'Product deleted' })
  } catch (err) {
    req.logger.error(err)
    return res.status(500).json({ error: 'An unexpected error ocurred' })
  }
})

export default router
