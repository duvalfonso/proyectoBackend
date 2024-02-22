import __dirname from '../utils.js'

export default {
  welcome: {
    subject: '¡Bienvenido!',
    attachments: [
      {
        filename: 'image.png',
        path: `${__dirname}/public/img/1698538871710-Captura de pantalla 2023-10-24 211527.png`
      }
    ]
  },
  reset_password: {
    subject: 'Reestablecer la contraseña'
  }
}
