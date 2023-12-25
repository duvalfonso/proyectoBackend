import express from 'express'
import passport from 'passport'
import ProductManager from '../dao/fileSystem/managers/productManager.js'
import { buildResponsePaginated } from '../utils.js'

// import mongoose from 'mongoose'
import UserModel from '../dao/mongo/models/user.js'
import ProductModel from '../dao/mongo/models/product.js'
import CartModel from '../dao/mongo/models/cart.js'

import dotenv from 'dotenv'
dotenv.config()

// const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`

const productManager = new ProductManager('./files/products.json')

async function initializeProductManager () {
  await productManager.initialize()
}
initializeProductManager()

const router = express.Router()

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
  const result = await ProductModel.paginate(criteria, options)
  const urlBase = 'http://localhost:8080/'
  const data = buildResponsePaginated({ ...result, sort, search }, urlBase)

  res.render('index', {
    title: 'Productos',
    style: 'products.css',
    ...data
  })
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await CartModel.findById({ _id: cid }).lean()
    const cartItems = cart.items
    res.render('cart', {
      title: 'Carritos',
      style: 'cart.css',
      cartItems,
      cart
    })
  } catch (err) {
    console.error(err.message)
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
    res.status(400).send({ error: err.message })
  }
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  })
})

// router.post('/api/sessions/login', async (req, res) => {
//   const { email, password } = req.body
//   const user = await UserModel.findOne({ email, password })
//   if (!user) { res.render('error', { title: 'Error' }) }
// })

// Router GET with Sessions
// router.get('/profile', (req, res) => {
//   console.log(req.user)
//   if (!req.cookies.authToken) {
//     return res.redirect('/login')
//   }
//   const user = req.user.toJSON()
//   res.render('profile', {
//     user,
//     name: `${user.firstName} ${user.lastName}`,
//     title: 'My Profile'
//   })
// })

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

router.get('/recover-password', (req, res) => {
  res.render('recover-pass', { title: 'Recuperar contraseña' })
})

export default router
