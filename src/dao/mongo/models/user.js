import mongoose from 'mongoose'

const collection = 'Users'

const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  age: { type: Number }
})

const userModel = mongoose.model(collection, schema)

export default userModel
