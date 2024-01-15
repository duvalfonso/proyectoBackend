import express from 'express'
// import session from 'express-session'
import passport from 'passport'
import __dirname from './utils.js'
import cookieParser from 'cookie-parser'
import { initializePassport } from './config/passport.config.js'
// import MongoStore from 'connect-mongo'

import productsRouter from './routes/api/products.router.js'
import cartsRouter from './routes/api/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import indexRouter from './routes/api/index.router.js'
// import authRouter from './routes/auth.router.js'

import SessionsRouter from './routes/api/Sessions.router.js'
import usersRouter from './routes/api/users.router.js'
import monProductsRouter from './routes/api/mongooseProduct.router.js'
import monCartsRouter from './routes/api/mongooseCart.router.js'

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

// const SESSION_SECRET = 'secret-string'

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}. ${server} `))

const connection = mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`
)
console.log(connection)

const io = new Server(server)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
initializePassport()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// app.use(session({
//   store: new MongoStore({
//     mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`,
//     ttl: 240
//   }),
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))

app.use(passport.initialize())
// app.use(passport.session())

const sessionsRouter = new SessionsRouter()

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api/sessions', sessionsRouter.getRouter())
app.use('/', viewsRouter, indexRouter)

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
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
