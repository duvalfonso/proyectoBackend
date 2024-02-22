import LoggerService from '../services/logger.js'

const logger = new LoggerService()

const attachLogger = (req, res, next) => {
  req.logger = logger.logger
  // console.log(logger.logger)
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
  next()
}

export default attachLogger
