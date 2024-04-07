import express from 'express'
import passport from 'passport'
import __dirname from './utils.js'
import cookieParser from 'cookie-parser'
import { initializePassport } from './config/passport.config.js'

import productsRouter from './routes/api/products.router.js'
import fsCartsRouter from './routes/api/fsCart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views/views.router.js'
import indexRouter from './routes/api/index.router.js'
import mockRouter from './routes/api/mock.router.js'
import attachLogger from './middlewares/logger.js'
import loggerTest from './routes/api/loggertest.router.js'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import SessionsRouter from './routes/api/Sessions.router.js'
import usersRouter from './routes/api/Users.router.js'
import monProductsRouter from './routes/api/mongooseProduct.router.js'
import ticketsRouter from './routes/api/tickets.router.js'
import CartsRouter from './routes/api/Carts.router.js'

import { Server } from 'socket.io'
import ProductManager from './dao/fileSystem/managers/productManager.js'

import mongoose from 'mongoose'

import dotenv from 'dotenv'
import { Exception } from './utils/exceptions.js'
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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación del proyecto eCommerce',
      description: 'API REST'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const io = new Server(server)

app.use(attachLogger)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
initializePassport()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(passport.initialize())
// app.use(passport.session())

const sessionsRouter = new SessionsRouter()
const cartsRouter = new CartsRouter()
// const usersRouter = new usersRouter()

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api/sessions', sessionsRouter.getRouter())
app.use('/', viewsRouter, indexRouter)
app.use('/', mockRouter)
app.use('/loggerTest', loggerTest)

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter.getRouter())
app.use('/api/carts', fsCartsRouter)

app.use('/api/monproducts', monProductsRouter)
app.use('/api/moncarts', cartsRouter.getRouter())
app.use('/api/tickets', ticketsRouter)

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
  let message = 'Unexpected Error Ocurred'
  let statusCode = 500
  if (err instanceof Exception) {
    message = err.message
    statusCode = err.statusCode
  }
  console.error(err)
  res.status(statusCode).json({ status: 'error', message })
})
