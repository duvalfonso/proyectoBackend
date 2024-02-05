import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  req.logger.debug('This is a debug logger (debug)')
  req.logger.info('This is a info logger (info)')
  req.logger.http('This is a http logger (http)')
  req.logger.warning('This is a warning logger (warning)')
  req.logger.error('This is a error logger (error)')
  req.logger.fatal('This is a fatal logger (fatal)')
  res.send('Testing de logger con winston!')
})

export default router
