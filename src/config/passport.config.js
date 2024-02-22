import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../dao/mongo/models/user.js'
import { cartsService, usersService } from '../services/repositories.js'

import { cookieExtractor, createHash, isValidPassword } from '../utils.js'
import config from './config.js'
import UserInsertDTO from '../dto/User/insertDTO.js'
import UserTokenDTO from '../dto/User/tokenDTO.js'

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
          const user = await usersService.getUserByEmail({ email })
          if (user) {
            return done(null, false, { message: 'El usuario ya existe' })
          }

          const cart = await cartsService.createCart()

          const hashedPassword = createHash(password)
          const newUser = UserInsertDTO.getFrom({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            cart,
            role
          })
          const result = await usersService.createUser(newUser)
          return done(null, result)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // let resultUser
        const user = await usersService.getUserByEmail({ email })
        if (!user) return done(null, false, { message: 'Credenciales incorrectas' })

        const isNotValidPassword = !isValidPassword(password, user)
        if (isNotValidPassword) return done(null, false, { message: 'Contraseña inválida' })

        const resultUser = UserTokenDTO.getFrom(user)

        return done(null, resultUser)
      }
    )
  )

  const githubOpts = {
    clientID: `${config.passport.GITHUB_CLIENT_ID}`,
    clientSecret: `${config.passport.GITHUB_APP_SECRET}`,
    callbackUrl: `${config.passport.GITHUB_CALLBACK_URL}`
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
    secretOrKey: `${config.jwt.JWT_SECRET}`
  }, async (payload, done) => {
    try {
      return done(null, payload)
    } catch (error) {
      return done(error)
    }
  }))
}
