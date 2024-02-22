import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import fs from 'fs'
import Handlebars from 'handlebars'

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

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

export const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.authToken
  }
  return token
}

export const generateMailTemplate = async (template, payload) => {
  const content = await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`, 'utf-8')
  const precompiledContent = Handlebars.compile(content)
  const compiledContent = precompiledContent({ ...payload })
  return compiledContent
}
