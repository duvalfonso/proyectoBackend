import mongoose from 'mongoose'

const collection = 'Users'

const schema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.SchemaTypes.ObjectId, ref: 'Carts' },
  role: { type: String, enum: ['TEST', 'USER', 'PREMIUM', 'ADMIN', 'SUPERADMIN'], default: 'USER' },
  status: { type: String, default: 'active' },
  age: { type: Number },
  orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Tickets' }],
  resetPasswordCode: { type: String, default: null },
  documents: [{
    name: { type: String },
    reference: { type: String }
  }],
  lastConnection: { type: Date },
  avatar: { type: String }
})

const userModel = mongoose.model(collection, schema)

export default userModel
