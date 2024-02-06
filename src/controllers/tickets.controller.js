import { ticketsService, cartsService, productsService } from '../services/repositories.js'

const getTickets = async (req, res) => {
  try {
    if (req.user) {
      const tickets = await ticketsService.getTickets()
      res.send({ status: 'success', payload: tickets })
    }
  } catch (err) {
    req.logger.error({ status: 'error', error: err.message })
  }
}

const getTicketById = async (req, res) => {
  const { ticketId } = req.params
  const ticket = ticketsService.getTicketById({ _id: ticketId })
  res.send({ status: 'success', payload: ticket })
}

const createTicket = async (req, res) => {
  try {
    const cartId = req.user.cart
    const cart = await cartsService.getCartById(cartId)
    if (!cart) return res.status(404).send({ status: 'error', error: `Cart with id: ${cartId} not found!` })

    const productsOutOfStock = []
    const productsToUpdateStock = []

    for (const item of cart.items) {
      const product = item.productId
      if (product.stock >= item.quantity) {
        productsToUpdateStock.push({ productId: product._id, newStock: product.stock - item.quantity })
      } else {
        productsOutOfStock.push(product)
      }
    }

    if (productsOutOfStock.length > 0) {
      return res.status(400).send({
        status: 'error',
        error: 'Some products in the cart have insufficient stock',
        productsOutOfStock
      })
    }

    for (const { productId, newStock } of productsToUpdateStock) {
      await productsService.updateProductStock(productId, newStock)
    }

    const ticketProducts = cart.items
      .map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        total: item.total
      }))

    const ticketData = {
      user: req.user._id,
      cartId: cart._id,
      products: ticketProducts,
      totalPrice: cart.subTotal,
      status: 'preparing',
      date: new Date()
    }

    const newTicket = await ticketsService.createTicket(ticketData)

    for (const { productId, newStock } of productsToUpdateStock) {
      await productsService.updateProductStock(productId, newStock)
    }

    res.status(201).send({ status: 'success', payload: newTicket })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(400).send({ status: 'error', error: 'An error ocurred while creating the ticket' })
  }
}
const updateTicket = async (req, res) => {
  try {
    const { tid, ticketData } = req.body
    const updatedTicket = await ticketsService.updateTicket(tid, ticketData)
    res.send({ status: 'success', payload: updatedTicket })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(400).send({ status: 'error', error: 'Invalid ticket data or ticket not found' })
  }
}

const deleteTicket = async (req, res) => {
  try {
    const { tid } = req.body
    const result = await ticketsService.deleteTicket(tid)
    res.send({ status: 'success', message: 'Ticket deleted', payload: result })
  } catch (err) {
    req.logger.error({ error: err.message })
    res.status(400).send({ status: 'error', error: err })
  }
}

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
}
