import { expect } from 'chai'
import supertest from 'supertest'
// import { createHash, isValidPassword } from '../src/utils.js'

const requester = supertest('http://localhost:8080')

describe('Super Testing', function () {
  describe('de Sessions', function () {
    before(function () {
      this.cookie = {}
    })
    // it('Debería registrar usuario de forma exitosa.', async function () {
    //   const registerMock = {
    //     firstName: 'super',
    //     lastName: 'testing',
    //     email: 'super@test.ing',
    //     password: 'supertest',
    //     role: 'test'
    //   }

    //   const { statusCode, ok, _body } = await requester
    //     .post('/api/sessions/register')
    //     .send(registerMock)

    //   expect(statusCode).to.equal(200)
    //   expect(_body).to.have.property('status', 'success')
    //   expect(_body.payload).to.have.property('password', createHash(registerMock.password))

    //   console.log(statusCode, ok, _body)
    // })

    it('Debería iniciar sesión de forma exitosa y no contener rastro del password en el resultado.', async function () {
      const loginData = {
        email: 'super@test.ing',
        password: 'supertest'
      }

      const { statusCode, ok, _body } = await requester
        .post('/api/sessions/login')
        .send(loginData)

      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.ok
      expect(_body.payload).to.have.property('name')
      expect(_body.payload).to.not.have.property('password')
    })

    it('Debería verificar el usuario actual a traves del token guardado en las cookies.', async function () {
      const { statusCode, ok, _body } = await requester.get('/api/sessions/current')
      console.log('body:', _body)
      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.ok
      expect(_body).to.have.property('status', 'success')
      expect(_body).to.have.property('payload')
    })

    it('Debería cerrar sesión activa, eliminando la cookie guardada.', async function () {
      const { statusCode, ok, _body } = await requester.post('/api/sessions/logout')
      expect(statusCode).to.be.equals(200)
      expect(ok).to.be.ok
      expect(_body).to.have.property('message', 'Logged out successfully')
      console.log(_body)
    })
  })
})
