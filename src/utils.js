import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// const BASE_URL = 'http://localhost:8080/api'

export const buildResponsePaginated = (data, baseUrl) => {
  return {
    status: 'success',
    payload: data.docs.map((doc) => doc.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.prevPage}${data.sort ? `&sort=${data.sort}` : ''}${data.search ? `&search=${data.search}` : ''}`
      : null,
    nextLink: data.hasNextPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.nextPage}${data.sort ? `&sort=${data.sort}` : ''}${data.search ? `&search=${data.search}` : ''}`
      : null
  }
}
