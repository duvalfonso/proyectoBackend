import multer from 'multer'
import __dirname from '../utils.js'
import { InvalidDataException } from '../utils/exceptions.js'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { params: { filetype } } = req
    let folderPath = null
    switch (filetype) {
      case 'avatar':
        folderPath = `${__dirname}/public/img/avatars`
        break
      case 'document':
        folderPath = `${__dirname}/public/img/documents`
        break
      case 'product':
        folderPath = `${__dirname}/public/img/products`
        break
      default:
        return cb(new InvalidDataException('Invalid type file'))
    }
    fs.mkdirSync(folderPath, { recursive: true })
    return cb(null, folderPath)
  },

  filename: function (req, file, cb) {
    const { user: { id } } = req
    return cb(null, `${id}_${file.originalname}`)
  }
})

const uploader = multer({ storage })

export default uploader
