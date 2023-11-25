import express from 'express'
import ProductManager from '../dao/fileSystem/managers/productManager.js'
import { buildResponsePaginated } from '../utils.js'

// import mongoose from 'mongoose'
import ProductModel from '../dao/mongo/models/product.js'

import dotenv from 'dotenv'
dotenv.config()

// const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`

const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}
initializeProductManager()

const router = express.Router()

router.get('/products', async (req, res) => {
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
  const result = await ProductModel.paginate(criteria, options)
  const urlBase = 'http://localhost:8080/'
  const data = buildResponsePaginated({ ...result, sort, search }, urlBase)

  res.render('index', {
    title: 'Productos',
    ...data
  })
})

router.post('/products', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status } =
    req.body
  try {
    const newProduct = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status
    )

    req.io.emit('update-list', newProduct)
    res.send({ status: 'success', payload: newProduct })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.delete('/products/:id', async (req, res) => {
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
