import mongoose from 'mongoose'

const collection = 'Users'

const schema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.SchemaTypes.ObjectId, ref: 'Carts' },
  role: { type: String, enum: ['test', 'user', 'premium', 'admin', 'superadmin'], default: 'user' },
  status: { type: String, default: 'active' },
  age: { type: Number },
  orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Tickets' }]
})

const userModel = mongoose.model(collection, schema)

export default userModel
