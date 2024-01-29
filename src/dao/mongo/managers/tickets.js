import ticketModel from '../models/ticket.js'

export default class TicketsManager {
  getTickets = () => {
    return ticketModel.find()
  }

  getTicketById = (id) => {
    return ticketModel.findById(id)
  }

  createTicket = (ticket) => {
    return ticketModel.create(ticket)
  }

  updateTicket = (id, data) => {
    return ticketModel.updateOne({ _id: id }, { $set: data })
  }

  deleteTicket = (id) => {
    return ticketModel.deleteOne({ _id: id })
  }
}
