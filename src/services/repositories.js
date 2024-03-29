import CartRepository from './Repositories/CartRepository.js'
import ProductRepository from './Repositories/ProductRepository.js'
import UserRepository from './Repositories/UserRepository.js'
import TicketRepository from './Repositories/TicketRepository.js'

import DaoCartsManager from '../dao/mongo/managers/carts.js'
import DaoProductsManager from '../dao/mongo/managers/products.js'
import UsersManager from '../dao/mongo/managers/users.js'
import TicketsManager from '../dao/mongo/managers/tickets.js'

export const cartsService = new CartRepository(new DaoCartsManager())
export const productsService = new ProductRepository(new DaoProductsManager())
export const usersService = new UserRepository(new UsersManager())
export const ticketsService = new TicketRepository(new TicketsManager())
