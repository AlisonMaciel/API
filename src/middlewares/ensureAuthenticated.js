const {verify} = require("jsonwebtoken")
const AppError = require("../utils/AppError.js")
const authConfig = require("../configs/auth.js")

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError("JWT toke não informado", 401)
    }

    const [, token] = authHeader.split(" ")
    
    try {
        const {sub: user_id} = verify(token, authConfig.jwt.secret)

        request.user = {
            id: Number(user_id)
        }

        return next()
    } catch {
        throw new AppError("JWT toke inválido", 401)
    }
}

module.exports = ensureAuthenticated