import nodemailer from 'nodemailer'
import DMailInfo from '../constants/DMailInfo.js'
import { generateMailTemplate } from '../utils.js'

export default class MailingService {
  constructor () {
    this.mailer = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  sendMail = async (emails, template, payload) => {
    const mailInfo = DMailInfo[template]
    const html = await generateMailTemplate(template, payload)
    const result = await this.mailer.sendMail({
      from: '"Fake Store 🧞‍♂️" <fake@store.mail>',
      to: emails,
      html,
      ...mailInfo
    })
    return result
  }
}
