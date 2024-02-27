import mongoose from 'mongoose'

import productModel from './dao/mongo/models/product.js'

import dotenv from 'dotenv'
dotenv.config()

const data = [
  {
    title: 'title 2',
    category: 'Category TWO',
    description: 'description 2',
    price: 9.95,
    thumbnail: 'thumbnail2.jpg',
    code: '10001',
    stock: 95,
    available: false
  },
  {
    title: 'title 3',
    category: 'Category ONE',
    description: 'description 3',
    price: 1.46,
    thumbnail: 'thumbnail3.jpg',
    code: '10002',
    stock: 3,
    available: true
  },
  {
    title: 'title 4',
    category: 'Category TWO',
    description: 'description 4',
    price: 0.87,
    thumbnail: 'thumbnail4.jpg',
    code: '10003',
    stock: 90,
    available: false
  },
  {
    title: 'title 5',
    category: 'Category TWO',
    description: 'description 5',
    price: 6.09,
    thumbnail: 'thumbnail5.jpg',
    code: '10004',
    stock: 49,
    available: false
  },
  {
    title: 'title 6',
    category: 'Category ONE',
    description: 'description 6',
    price: 8.9,
    thumbnail: 'thumbnail6.jpg',
    code: '10005',
    stock: 20,
    available: true
  },
  {
    title: 'title 7',
    category: 'Category ONE',
    description: 'description 7',
    price: 2.9,
    thumbnail: 'thumbnail7.jpg',
    code: '10006',
    stock: 49,
    available: false
  },
  {
    title: 'title 8',
    category: 'Category ONE',
    description: 'description 8',
    price: 7.08,
    thumbnail: 'thumbnail8.jpg',
    code: '10007',
    stock: 93,
    available: false
  },
  {
    title: 'title 9',
    category: 'Category TWO',
    description: 'description 9',
    price: 3.33,
    thumbnail: 'thumbnail9.jpg',
    code: '10008',
    stock: 36,
    available: true
  },
  {
    title: 'title 10',
    category: 'Category TWO',
    description: 'description 10',
    price: 0.11,
    thumbnail: 'thumbnail10.jpg',
    code: '10009',
    stock: 88,
    available: false
  },
  {
    title: 'title 11',
    category: 'Category ONE',
    description: 'description 11',
    price: 3.65,
    thumbnail: 'thumbnail11.jpg',
    code: '10010',
    stock: 12,
    available: true
  },
  {
    title: 'title 12',
    category: 'Category ONE',
    description: 'description 12',
    price: 9.27,
    thumbnail: 'thumbnail12.jpg',
    code: '10011',
    stock: 83,
    available: false
  },
  {
    title: 'title 13',
    category: 'Category ONE',
    description: 'description 13',
    price: 2.64,
    thumbnail: 'thumbnail13.jpg',
    code: '10012',
    stock: 44,
    available: false
  },
  {
    title: 'title 14',
    category: 'Category THREE',
    description: 'description 14',
    price: 0.04,
    thumbnail: 'thumbnail14.jpg',
    code: '10013',
    stock: 67,
    available: false
  },
  {
    title: 'title 15',
    category: 'Category ONE',
    description: 'description 15',
    price: 3.02,
    thumbnail: 'thumbnail15.jpg',
    code: '10014',
    stock: 92,
    available: false
  },
  {
    title: 'title 16',
    category: 'Category TWO',
    description: 'description 16',
    price: 3.28,
    thumbnail: 'thumbnail16.jpg',
    code: '10015',
    stock: 91,
    available: true
  },
  {
    title: 'title 17',
    category: 'Category TWO',
    description: 'description 17',
    price: 6.97,
    thumbnail: 'thumbnail17.jpg',
    code: '10016',
    stock: 17,
    available: true
  },
  {
    title: 'title 18',
    category: 'Category THREE',
    description: 'description 18',
    price: 7.44,
    thumbnail: 'thumbnail18.jpg',
    code: '10017',
    stock: 53,
    available: true
  },
  {
    title: 'title 19',
    category: 'Category TWO',
    description: 'description 19',
    price: 3.2,
    thumbnail: 'thumbnail19.jpg',
    code: '10018',
    stock: 72,
    available: true
  },
  {
    title: 'title 20',
    category: 'Category ONE',
    description: 'description 20',
    price: 3.92,
    thumbnail: 'thumbnail20.jpg',
    code: '10019',
    stock: 12,
    available: true
  }
]

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fueracc.mongodb.net/${process.env.DEFAULT_DATA_BASE}?retryWrites=true&w=majority`

async function test () {
  try {
    await mongoose.connect(URI)
    console.log('DB connected')
    await productModel.insertMany(data)
  } catch (err) {
    console.error(err.message)
  }
}

test()
