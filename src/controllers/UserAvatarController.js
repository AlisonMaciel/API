const knex = require("../database/knex/index.js")
const AppError = require("../utils/AppError.js")
const DiskStorage = require("../providers/DiskStorage.js")

class UserAvatarController {
 async update(request, response) {
    const user_id = request.user.id
    const avatarFileName = request.file.filename
    const diskStorage = new DiskStorage()

    const user = await knex("users")
    .where({id: user_id})
    .first()

    if(!user) {
        throw new AppError("Somente usuários autenticados podem mudar o avatar", 401)
    }

    if(user.avatar) {
        await diskStorage.deletefile(user.avatar)
    }

    const fileName = await diskStorage.savefile(avatarFileName)
    user.avatar = fileName

    await knex("users").where({id: user_id}).update({avatar: fileName})

    return response.json({avatar: fileName})
 }
}

module.exports = UserAvatarController