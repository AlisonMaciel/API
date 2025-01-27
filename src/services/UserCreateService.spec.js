const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError.js")

describe("UserCreateService", () => {

    let userRepositoryInMemory = null
    let userCreateService = null

    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory()
        userCreateService = new UserCreateService(userRepositoryInMemory)
    })
     
    it("user should be create",  async () => {
        const user = {
            name: "User Test",
            email: "user@test.com",
            password: "123"
        }
    
        const userCreted = await userCreateService.execute(user)
        
        expect(userCreted).toHaveProperty("id")
    })

    it("check if the email already exists",  async () => {
        const user1 = {
            name: "user1",
            email: "test@1gmail.com",
            password: "123"
        }

        const user2 = {
            name: "user2",
            email: "test@1gmail.com",
            password: "456"
        } 

        await userCreateService.execute(user1)
        expect(async () => {
            await userCreateService.execute(user2)
        }).rejects.toEqual(new AppError("Esse email já está em Cadastrado."))
    })
}) 