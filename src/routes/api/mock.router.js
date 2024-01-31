import { Router } from 'express'
import ProductModel from '../../dao/mongo/models/product.js'

const router = Router()

router.get('/mockingproducts', async (req, res) => {
  try {
    const mockProducts = generateMockProducts()
    const createdProducts = await ProductModel.insertMany(mockProducts)
    res.send({ status: 'success', payload: createdProducts })
  } catch (error) {
    res.status(500).send(customizeError('internalServerError'))
  }
})

function generateMockProducts () {
  const mockProducts = []
  for (let i = 1; i <= 100; i++) {
    mockProducts.push({
      title: `Mock Product ${i + 100}`,
      category: 'Category ONE',
      description: `Description for Mock Product ${i + 100}`,
      price: Math.floor(Math.random() * 100) + 1,
      thumbnail: [],
      code: `mock_product_${i}`,
      stock: Math.floor(Math.random() * 100) + 1,
      status: true
    })
  }
  return mockProducts
}

const errorDictionary = {
  ticketCreationError: 'An error ocurred while creating the ticket',
  productCreationError: 'An error ocurred while creating the product',
  addToCartError: 'An error ocurred while adding one or more products to the cart',
  registerError: 'An error ocurred while creating the user account',
  loginError: 'An error ocurred loggin into account'
}

function customizeError (errorType) {
  return {
    error: true,
    message: errorDictionary[errorType] || 'Unkown error'
  }
}

export default router
