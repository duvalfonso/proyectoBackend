import mongoose from 'mongoose'
import { expect } from 'chai'
import { cartsService } from '../../src/services/repositories.js'

describe('Testing Carts Dao', function () {
  before(async function () {
    await mongoose.connect(
      'mongodb+srv://duvalfonso:LOd0JoF7rWaKU7mT@cluster0.fueracc.mongodb.net/eCommerce-test?retryWrites=true&w=majority'
    )
  })

  beforeEach(async function () {
    await mongoose.connection.collections.carts.drop()
  })

  after(async function () {
    await mongoose.connection.close()
  })

  it('Crea carrito de forma exitosa', async function () {
    const result = await cartsService.createCart()

    expect(result).to.be.ok
    expect(result).to.have.property('subTotal', 0)
  })
})
