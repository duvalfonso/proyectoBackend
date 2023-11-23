import mongoose from 'mongoose'

const collection = 'Products'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Category ONE', 'Category TWO', 'Category THREE'],
    default: 'Category ONE'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: Array,
    default: []
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const productModel = mongoose.model(collection, schema)

export default productModel
