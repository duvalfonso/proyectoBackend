import { ticketsService, cartsService, productsService } from '../services/repositories.js'

const getTickets = async (req, res) => {
  const tickets = await ticketsService.getTickets()
  console.log(req.user)
  res.send({ status: 'success', payload: tickets })
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

    // If there are products with insufficient stock, inform the buyer and ask for confirmation
    if (productsOutOfStock.length > 0) {
      return res.status(400).send({
        status: 'error',
        error: 'Some products in the cart have insufficient stock',
        productsOutOfStock
      })
    }

    // Update product stock
    for (const { productId, newStock } of productsToUpdateStock) {
      await productsService.updateProductStock(productId, newStock)
    }

    // Construct ticket data using cart information
    const ticketProducts = cart.items
      .map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        total: item.total
      }))

    const ticketData = {
      user: req.user._id, // Assuming user ID is available in req.user
      cartId: cart._id,
      products: ticketProducts,
      totalPrice: cart.subTotal,
      status: 'preparing', // Set ticket status to "preparing"
      date: new Date() // Assuming current date is used as ticket date
    }

    // Create ticket using the constructed ticket data
    const newTicket = await ticketsService.createTicket(ticketData)

    // Update product stock after ticket creation
    for (const { productId, newStock } of productsToUpdateStock) {
      await productsService.updateProductStock(productId, newStock)
    }

    res.status(201).send({ status: 'success', payload: newTicket })
  } catch (err) {
    console.error({ error: err.message })
    res.status(400).send({ status: 'error', error: 'An error ocurred while creating the ticket' })
  }
}
const updateTicket = async (req, res) => {
  try {
    const { tid, ticketData } = req.body
    const updatedTicket = await ticketsService.updateTicket(tid, ticketData)
    res.send({ status: 'success', payload: updatedTicket })
  } catch (err) {
    console.error({ error: err.message })
    res.status(400).send({ status: 'error', error: 'Invalid ticket data or ticket not found' })
  }
}

const deleteTicket = async (req, res) => {
  try {
    const { tid } = req.body
    const result = await ticketsService.deleteTicket(tid)
    res.send({ status: 'success', message: 'Ticket deleted', payload: result })
  } catch (err) {
    console.error({ error: err.message })
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
