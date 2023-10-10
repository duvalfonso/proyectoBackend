import express from 'express'
import ProductManager from './managers/productManager.js'

const productManager = new ProductManager('./files/products.json')

const app = express()
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}. ${server} `))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function initializeProductManager () {
  await productManager.initialize()
}

initializeProductManager()

app.get('/products', async (req, res) => {
  const limit = Number(req.query.limit)
  console.log(limit)
  const products = await productManager.getProductsList()
  if (limit < 0 || isNaN(limit)) {
    return res.status(400).send({ error: 'Invalid limit parameter. Only use numbers greater than 0' })
  }
  if (!limit) {
    return res.send({ status: 'success', payload: products })
  }
  const limitResult = products.slice(0, limit)
  res.send({ status: 'success', payload: limitResult })
})

app.get('/products/:pid', async (req, res, next) => {
  try {
    const pid = Number(req.params.pid)
    if (isNaN(pid)) return res.status(400).send({ error: 'Product id must be a number!' })
    const productById = await productManager.getProductById(pid)
    res.send({ status: 'success', payload: productById })
  } catch (err) {
    next(err.message)
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(404).send({ error: 'Not found' }).end()
})
