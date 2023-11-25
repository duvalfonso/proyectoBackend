import { Router } from "express"
import ProductModel from "../dao/mongo/models/product.js"
import { buildResponsePaginated } from "../utils.js"

const router = Router()

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query
  const criteria = {}
  const options = { limit, page }
  if (sort) {
    options.sort = sort
      ? sort === 'asc'
        ? { price: 1 }
        : sort === 'desc'
          ? { price: -1 }
          : null
      : null
  }
  if (search) {
    criteria.category = search
  }
  const result = await ProductModel.paginate(criteria, options)
  res.status(200).json(buildResponsePaginated({ ...result, sort, search }))
})
