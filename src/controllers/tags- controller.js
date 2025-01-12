const knex = require("../database/knex")

class TagsController {
    async show(request, response) {
        const user_id = request.user.id

        const showTags = await knex("tags")
        .where({user_id})
        .orderBy("name")
        .groupBy("name")

        return response.json(showTags)
    }
}

module.exports = TagsController