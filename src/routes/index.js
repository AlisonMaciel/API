const { Router } = require("express");

const usersRouter = require("./user.routes.js"); // estamos acessando ele aq
const notesRouter = require("./notes.routes.js");
const tagRouter = require("./tags.routes.js")
const sessionsRouter = require("./sessions.routes.js")

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/notes", notesRouter);
routes.use("/tags", tagRouter);
routes.use("/sessions", sessionsRouter)

module.exports = routes;
