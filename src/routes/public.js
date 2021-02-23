const publicRouter = require("express").Router();
const config = require("../utils/config");

publicRouter.get("/file/product-images/:name", async (req, res, next) => {
  try {
    const fileName = req.params.name;
    console.log(fileName);
    res.download(fileName, "a.png");
  } catch (error) {
    next(error);
  }
});

module.exports = publicRouter;
