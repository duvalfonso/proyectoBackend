import mongoose from 'mongoose'

const collection = 'Carts'

const ItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Products'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1']
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, { timestamps: true, _id: false })

const CartSchema = new mongoose.Schema({
  items: [ItemSchema],
  subTotal: {
    default: 0,
    type: Number
  }
}, { timestamps: true })

CartSchema.pre(['find', 'findOne'], function () {
  this.populate('items.productId')
})

const cartModel = mongoose.model(collection, CartSchema)

export default cartModel
