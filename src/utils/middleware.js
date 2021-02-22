const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("./config");
const multer = require("multer");

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

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }

  logger.error(error.message);
  return res.status(400).json({ error: error.message });
};

const getTokenForm = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const verifySignIn = async (req, res, next) => {
  try {
    const token = getTokenForm(req);
    if (!token) return res.status(401).json({ error: "Access denied." });
    const decodedToken = await jwt.verify(token, config.JWT_SECRET);
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: "Access denied." });
    }
    req.user = {
      id: decodedToken.id,
      role: decodedToken.role,
    };
  } catch (error) {
    next(error);
  }
  next();
};

const adminRoleRequired = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(401).json({ error: "Access denied." });
    }
  } catch (error) {
    next(error);
  }
  next();
};

const userRoleRequired = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "user") {
      return res.status(401).json({ error: "Access denied." });
    }
  } catch (error) {
    next(error);
  }
  next();
};

const uploadFiles = (req, res, next) => {
  const upload = multer({ dest: config.UPLOAD_DIR }).any();
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: "Failed to upload files" });
    } else if (error) {
      next(error);
      return;
    }
    next();
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifySignIn,
  adminRoleRequired,
  userRoleRequired,
  uploadFiles,
};
