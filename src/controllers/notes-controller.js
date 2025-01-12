const knex = require("../database/knex")

class NotesController {
    async create(request, response) {
        const {title, descripiton, tags, links} = request.body
        const user_id = request.user.id

         const [note_id] = await knex("notes").insert({title, descripiton, user_id})

         const LinksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
         })

         await knex("links").insert(LinksInsert)

         const TagsInsert = tags.map(name => {
            return {
                name,
                note_id,
                user_id
            }
         })

         await knex("tags").insert(TagsInsert)

         response.json()
    }

    async show(request, response) {
        const {id} = request.params
        
        const note = await knex("notes").where({id}).first()
        const tag = await knex("tags").where({note_id: id}).orderBy("name")
        const links = await knex("links").where({note_id: id}).orderBy("created_at")
        
        return response.json({
            note,
            tag,
            links
        })
    }

    async delete(request, response) {
        const {id} = request.params

        await knex("notes").where({id}).delete()

        return response.json({Message: "Nota deletada com sucesso."})
    }

    async index(request, response) {
            try {
                const { title, tags } = request.query;
                const user_id = request.user.id;
        
                let notes;
        
                if (tags) {
                    const filterTags = tags.split(',')
                    console.log("Tags recebidas:", filterTags);
        
                    notes = await knex("tags")
                        .select([
                            "notes.id",
                            "notes.title",
                            "notes.descripiton",
                            "notes.user_id",
                        ])
                        .innerJoin("notes", "notes.id", "tags.note_id")
                        .where("tags.user_id", user_id) 
                        .whereLike("notes.title", `%${title}%`)
                        .whereIn("tags.name", filterTags)
                        .groupBy("notes.id")
                        .orderBy("notes.title");
                } else {
                    notes = await knex("notes")
                        .where({ user_id })
                        .whereLike("notes.title", `%${title}%`)
                        .orderBy("notes.title");
                }
        
                const userTags = await knex("tags").where({ user_id });
                const notesAndTags = notes.map(note => {
                    const filterTags = userTags.filter(tag => tag.note_id === note.id);
                    return { ...note, tags: filterTags };
                });
        
                return response.json(notesAndTags);
            } catch (error) {
                console.error("Erro no servidor:", error.message, error.stack);
                return response.status(500).json({ status: "error", message: "erro no servidor" });
            }
        }
        
}

module.exports = NotesController