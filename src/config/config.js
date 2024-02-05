export default {
  app: {
    PORT: process.env.PORT || 8080,
    SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
    LOGGER_ENV: process.env.LOGGER_ENV || 'dev'
  },
  mongo: {
    URL: process.nextTick.URL
  }
}
