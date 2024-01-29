import mongoose from 'mongoose'

const collection = 'Tickets'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users'
  },
  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Carts'
  },
  products: [
    {
      productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: [
      'pending',
      'preparing',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const ticketModel = mongoose.model(collection, schema)

export default ticketModel
