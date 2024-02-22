import { Router } from 'express'
import ProductModel from '../../dao/mongo/models/product.js'

const router = Router()

router.get('/mockingproducts', async (req, res) => {
  try {
    const mockProducts = generateMockProducts()
    const createdProducts = await ProductModel.insertMany(mockProducts)
    res.send({ status: 'success', payload: createdProducts })
  } catch (error) {
    res.status(500).send({ error: error.message })
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

export default router
