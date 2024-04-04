import { productsService } from '../services/repositories.js'
import uploader from '../services/uploader.js'

const getProducts = async (req, res) => {
  try {
    const products = await productsService.getProducts()
    res.send({ status: 'success', payload: products })
  } catch (err) {
    req.logger.error(err)
    return res.status(500).json({ status: 'error', error: err })
  }
}

const getProductById = async (req, res) => {
  const { pid } = req.params
  const product = await productsService.getProductById({ _id: pid })
  res.send({ status: 'success', payload: product })
}

const createProduct = (uploader.array('thumbnail'), async (req, res) => {
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

const updateProduct = async (req, res) => {
  const { pid } = req.params
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
}

const deleteProduct = async (req, res) => {
  const { pid } = req.params
  const result = await productsService.deleteProduct(pid)
  req.logger.info(result)
  res.send({ status: 'success', message: 'Product deleted' })
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
