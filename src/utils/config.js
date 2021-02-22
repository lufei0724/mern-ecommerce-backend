const env = require("dotenv");
const fsPromise = require("fs/promises");
const path = require("path");

env.config();

const PORT = process.env.PORT || 3001;
let DB_URL = process.env.DB_URL;

if (process.env.NODE_ENV === "test") {
  DB_URL = process.env.TEST_DB_URL;
}

const JWT_SECRET = process.env.JWT_SECRET;

const UPLOAD_DIR = path.join(__dirname, "../..", "uploads");
(async () => {
  try {
    await fsPromise.stat(UPLOAD_DIR);
  } catch (error) {
    fsPromise.mkdir(UPLOAD_DIR);
  }
})();

module.exports = {
  PORT,
  DB_URL,
  JWT_SECRET,
  UPLOAD_DIR,
};
