const initRouter = require("express").Router();
const { initDB } = require("../controllers/init");

initRouter.get("/init-db", initDB);

module.exports = initRouter;
