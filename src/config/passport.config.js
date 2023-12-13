import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
// import { Strategy as GithubStrategy } from 'passport-github2'
import UserModel from '../dao/mongo/models/user.js'

import { createHash, isValidPassword } from '../utils.js'

export const initializePassport = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true
  }
  passport.use(
    'register',
    new LocalStrategy(
      registerOpts,
      async (req, email, password, done) => {
        try {
          const {
            body: {
              firstName,
              lastName,
              role = 'user'
            }
          } = req
          if (!firstName || !lastName) {
            return done(new Error('Todos los campos son requeridos'))
          }
          const user = await UserModel.findOne({ email })
          if (user) {
            return done(null, false, { message: 'El usuario ya existe' })
          }

          const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: createHash(password),
            role
          })
          done(null, newUser)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        let user = await UserModel.findOne({ email })
        if (!user) {
          return done(null, false, { message: 'Credenciales incorrectas' })
        }

        const isNotValidPassword = !isValidPassword(password, user)
        if (isNotValidPassword) {
          return done(null, false, { message: 'Contraseña inválida' })
        }

        user = {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        }
        return done(null, user)
      }
    )
  )

  passport.serializeUser(function (user, done) {
    return done(null, user.id)
  })

  passport.deserializeUser(async function (id, done) {
    const user = await UserModel.findOne({ _id: id })
    return done(null, user)
  })
}
