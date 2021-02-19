const config = require("./utils/config");
//const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const authRouter = require("./routes/auth");

const app = express();

logger.info(`connecting to ${config.DB_URL}`);

mongoose
  .connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info(`Database connected`);
  })
  .catch((error) => {
    logger.info(`error connecting to DB: ${error.message}`);
  });

app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api", authRouter);
app.use(middleware.verifySignIn);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
