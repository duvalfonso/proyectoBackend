import nodemailer from 'nodemailer'
import config from '../config/config.js'
import DMailInfo from '../constants/DMailInfo.js'
import { generateMailTemplate } from '../utils.js'

export default class MailingService {
  constructor () {
    this.mailer = nodemailer.createTransport({
      service: config.mailer.service,
      port: config.mailer.PORT,
      auth: {
        user: config.mailer.USER,
        pass: config.mailer.PASSWORD
      }
    })
  }

  sendMail = async (emails, template, payload) => {
    const mailInfo = DMailInfo[template]
    const html = await generateMailTemplate(template, payload)
    const result = await this.mailer.sendMail({
      from: `${config.mailer.USER}`,
      to: emails,
      html,
      ...mailInfo
    })
    return result
  }
}
