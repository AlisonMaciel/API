const {Router} = require("express") 
const multer = require("multer")
const uploadConfigs = require("../configs/upload.js")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")
const UsersController = require("../controllers/users-controller.js")
const UserAvatarController = require("../controllers/UserAvatarController.js")

const uploads = multer(uploadConfigs.MULTER)
const usersRouter = Router() 

const usersController =  new UsersController()
const userAvatarController = new UserAvatarController()

usersRouter.post("/", usersController.create) 
usersRouter.put("/", ensureAuthenticated, usersController.update)
usersRouter.patch("/avatar", ensureAuthenticated, uploads.single("avatar"), userAvatarController.update)
usersRouter.delete("/:id", usersController.delete) 

module.exports = usersRouter 