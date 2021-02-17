const env = require("dotenv");

env.config();

const PORT = process.env.PORT || 3001;
let DB_URL = process.env.DB_URL;

module.exports = {
  PORT,
  DB_URL,
};
