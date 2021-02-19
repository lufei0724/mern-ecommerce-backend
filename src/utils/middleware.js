const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path", req.path);
  logger.info("Params", req.params);
  logger.info("Body:", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint " });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

const verifySignIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = await jwt.verify(token, config.JWT_SECRET);
      req.userToken = decoded;
    } catch (error) {
      next(error);
    }
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifySignIn,
};
