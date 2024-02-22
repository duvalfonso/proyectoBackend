export default {
  app: {
    PORT: process.env.PORT || 8080,
    SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
    LOGGER_ENV: process.env.LOGGER_ENV || 'dev'
  },
  mongo: {
    URL: process.env.MONGO_URL
  },
  jwt: {
    COOKIE: process.env,
    TOKEN_SECRET: process.env.JWT_SECRET
  },
  mailer: {
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    PORT: process.env.EMAIL_PORT,
    service: process.env.EMAIL_SERVICE
  },
  passport: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_APP_SECRET: process.env.GITHUB_APP_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL
  }
}
