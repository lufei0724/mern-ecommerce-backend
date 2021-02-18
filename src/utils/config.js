const env = require("dotenv");

env.config();

const PORT = process.env.PORT || 3001;
let DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  DB_URL,
  JWT_SECRET,
};
