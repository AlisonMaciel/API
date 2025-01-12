const Router = require("express")
const tagRouter = Router ()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

const TagsController = require("../controllers/tags- controller.js")
const tagsController = new TagsController()

tagRouter.get("/", ensureAuthenticated, tagsController.show)

module.exports = tagRouter