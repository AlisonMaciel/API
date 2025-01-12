const {Router} = require("express")

const SessionsController = require("../controllers/sessions-controller.js")
const sessionsController = new SessionsController ()

const sessionsRouter = Router()

sessionsRouter.post("/", sessionsController.create)

module.exports = sessionsRouter