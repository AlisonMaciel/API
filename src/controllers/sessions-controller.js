const knex = require("../database/knex")
const AppError = require("../utils/AppError.js")
const {compare} = require("bcryptjs")
const authConfig = require("../configs/auth.js")
const {sign} = require("jsonwebtoken")

class SessionsController {
    async create(request, response) {
        const {email, password} = request.body

       const user = await knex("users").where({email}).first()

       if(!user) {
        throw new AppError("E-mail e/ou senha invalidos", 401)
       }

       const checkPassword = await compare(password, user.password)

       if(!checkPassword) {
        throw new AppError("E-mail e/ou senha invalidos", 401)
       }

       const {secret, expiresIn} = authConfig.jwt
       const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
       })
       
       delete user.password

       return response.json({user, token})
    } 
}

module.exports= SessionsController