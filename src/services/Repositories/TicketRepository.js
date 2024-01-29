export default class TicketRepository {
  constructor (dao) {
    this.dao = dao
  }

  getTickets = () => {
    return this.dao.getTickets()
  }

  getTicketById = (id) => {
    return this.dao.getTicketById(id)
  }

  createTicket = (ticket) => {
    return this.dao.createTicket(ticket)
  }

  updateTicket = (id, data) => {
    return this.dao.updateTicket(id, data)
  }

  deleteTicket = (id) => {
    return this.dao.deleteTicket(id)
  }
}
