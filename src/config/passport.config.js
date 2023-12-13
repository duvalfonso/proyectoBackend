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
  passport.use('register', new LocalStrategy(registerOpts, async (req, email, password, done) => {
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
      return done(new Error(`Ya existe un usuario con el correo ${email}`))
    }
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: createHash(password),
      role
    })
    done(null, newUser)
  }))

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return done(new Error('Correo o contraseña inválidos'))
    }
    const isNotValidPassword = !isValidPassword(password, user)
    if (isNotValidPassword) {
      return done(new Error('Correo o contraseña inválidos'))
    }

    passport.serializeUser((user, done) => {
      done(null, user._id)
    })

    passport.deserializeUser(async (uid, done) => {
      const user = await UserModel.findById(uid)
      done(null, user)
    })
  }))
}
