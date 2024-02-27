import express from 'express'
import passport from 'passport'
import { passportCall } from '../../services/auth.js'
import ProductManager from '../../dao/fileSystem/managers/productManager.js'
import { buildResponsePaginated } from '../../utils.js'

// import mongoose from 'mongoose'
import UserModel from '../../dao/mongo/models/user.js'
import ProductModel from '../../dao/mongo/models/product.js'
import CartModel from '../../dao/mongo/models/cart.js'

import dotenv from 'dotenv'
dotenv.config()

// const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`

const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}
initializeProductManager()

const router = express.Router()

router.get('/', passportCall('jwt', { strategyType: 'jwt' }), async (req, res) => {
  if (!req.cookies.authToken) {
    return res.redirect('/login')
  }
  try {
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
    const loggedIn = req.cookies.authToken
    if (!req.user) {
      res.redirect('/login')
    }

    res.render('index', {
      title: 'Productos',
      style: 'products.css',
      ...data,
      loggedIn,
      cartId: req.user.cart
    })
  } catch (err) {
    req.logger.error({ error: err.message, message: 'Something went wrong' })
  }
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await CartModel.findById({ _id: cid }).lean()
    const cartItems = cart.items
    const loggedIn = req.cookies.authToken
    res.render('cart', {
      title: 'Carritos',
      style: 'cart.css',
      cartItems,
      cart,
      loggedIn
    })
  } catch (err) {
    req.logger.error(err.message)
  }
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
    req.logger.error({ message: 'Something went wrong', error: err.message })
    res.status(400).send({ error: err.message })
  }
})

router.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await productManager.deleteProduct(id)
    req.io.emit('remove-product', id)
    res.json({ message: 'Product succesfully deleted.' })
  } catch (err) {
    req.logger.error({ message: 'Something went wrong', error: err.message })
    res.status(400).send({ error: err.message })
  }
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

router.get('/login', (req, res) => {
  const loggedIn = req.cookies.authToken
  if (loggedIn) {
    return res.redirect('/')
  }
  res.render('login', {
    title: 'Login',
    loggedIn
  })
})

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.cookies.authToken) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const loggedIn = req.cookies.authToken
  const user = await UserModel.findById(req.user.id).lean()
  res.render('profile', {
    user,
    name: `${user.firstName} ${user.lastName}`,
    title: 'My Profile',
    loggedIn
  })
})

router.get('/reset-password', (req, res) => {
  res.render('reset-pass', { title: 'Recuperar contraseña' })
})

router.get('/reset-email-sent', (req, res) => {
  res.render('reset-email-sent', {
    title: 'Solicitud enviada!'
  })
})

router.get('/reset-password/:token/:uid', (req, res) => {
  const { token, uid } = req.params
  res.render('reset-form', {
    title: 'Establece una contraseña nueva!',
    token,
    uid
  })
})

export default router
