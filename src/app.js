import express from 'express'
import __dirname from './utils.js'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'

import monProductsRouter from './routes/mongooseProduct.router.js'
import monCartsRouter from './routes/mongooseCart.router.js'

import { Server } from 'socket.io'
import ProductManager from './dao/fileSystem/managers/productManager.js'

import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}
initializeProductManager()

const app = express()
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}. ${server} `))

const connection = mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`
)
console.log(connection)

const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/realtimeproducts', viewsRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use('/api/monproducts', monProductsRouter)
app.use('/api/moncarts', monCartsRouter)

io.on('connection', socket => {
  console.log('New client connected')

  socket.on('disconnect', () => {
    console.log('An user has disconnected')
  })

  socket.on('update-list', data => {
    io.emit('update-list', data)
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send({ error: 'Unexpected Error Ocurred' }).end()
})
