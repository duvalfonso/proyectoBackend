import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../dao/mongo/models/user.js'

import { cookieExtractor, createHash, isValidPassword } from '../utils.js'
import dotenv from 'dotenv'
dotenv.config()

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
          role: user.role,
          cart: user.cart
        }
        return done(null, user)
      }
    )
  )

  const githubOpts = {
    clientID: `${process.env.GITHUB_CLIENT_ID}`,
    clientSecret: `${process.env.GITHUB_APP_SECRET}`,
    callbackUrl: `${process.env.GITHUB_CALLBACK_URL}`
  }

  passport.use(
    'github',
    new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
      const email = profile._json.email
      let user = await UserModel.findOne({ email })
      if (user) {
        return done(null, user)
      }
      user = {
        firstName: profile._json.name,
        lastName: '',
        email,
        password: '',
        provider: 'github',
        providerId: profile.id
      }
      const newUser = await UserModel.create(user)
      done(null, newUser)
    })
  )

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'jwtSecret'
  }, async (payload, done) => {
    try {
      return done(null, payload)
    } catch (error) {
      return done(error)
    }
  }))

  // passport.serializeUser(function (user, done) {
  //   return done(null, user.id)
  // })

  // passport.deserializeUser(async function (id, done) {
  //   const user = await UserModel.findOne({ _id: id })
  //   return done(null, user)
  // })
}
