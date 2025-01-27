const sqliteConnection = require("../database/sqlite/index.js")
const AppError = require("../utils/AppError")
const {hash, compare} = require("bcryptjs")
const knex = require("../database/knex/index.js")
const authConfig = require("../configs/auth.js")
const { sign } = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository.js")
const UserCreateService = require("../services/UserCreateService.js")

class UsersController {
   async  create(request, response) {
   const {name, email, password} = request.body

   const userRepository = new UserRepository()
   const userCreateService = new UserCreateService(userRepository)
   await userCreateService.execute({name, email, password})

   return response.status(201).json() 
}

   async update(request, response) {
      const {name, email, passwordNew, passwordOld} = request.body
      const user_id = request.user.id

      const database = await sqliteConnection()
      const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

      if(!user) {
         throw new AppError("Usuário nao encontrado")
      }

      const updateUser = await database.get("SELECT * FROM users WHERE email = (?)", [email])

      if(updateUser && updateUser.id !== user.id) {
         throw new AppError("Este email já está em uso") 
      }

      user.name = name ?? user.name
      user.email = email ?? user.email 

      if(passwordNew && !passwordOld) {
         throw new AppError("Digite a senha antiga para poder atualizar a nova")
      }

      if(passwordNew && passwordOld) {
         const checkOldPassoword = await compare(passwordOld, user.password)

         if(!checkOldPassoword) {
            throw new AppError("A senha antiga nao confere")
         }

         user.password = await hash(passwordNew, 8)
      }

      await database.run(`
         UPDATE users SET
         name = ?,
         email = ?,
         password = ?,
         update_at = DATETIME('now')
         WHERE id = ?`,
      [user.name, user.email, user.password, user_id])

      const updatedUser = await knex("users").where({id: user_id}).first();

      const { secret, expiresIn } = authConfig.jwt;
      const newToken = sign({}, secret, {
         subject: String(updatedUser.id),
         expiresIn
      });

      return response.json({ user: updatedUser, token: newToken });

   }

   async delete(request, response) {
     
         const { id } = request.params;
      
         try {
            const user = await knex("users").where('id', id).first();

            if (!user) {
               return response.status(404).json({ message: "Usuário não encontrado" });
            }
      
            await knex("users").where('id', id).del();
            console.log("registro deletado com sucesso");
      
            return response.status(200)
            .json({ message: "Usuário deletado com sucesso" });

         } catch (error) {
            console.error(error);
            return response.status(500)
            .json({ message: "Erro ao deletar usuário", error: error.message });
         }
      }

   }

module.exports = UsersController  
