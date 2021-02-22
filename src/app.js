const config = require("./utils/config");
//const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

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
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
