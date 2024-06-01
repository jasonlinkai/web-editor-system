// src/database/sequelize.config.js
require('ts-node/register');
module.exports = {
  host: process.env.MYSQL_DATABASE_HOST,
  port: Number(process.env.MYSQL_DATABASE_PORT),
  database: process.env.MYSQL_DATABASE_DATABASE,
  username: process.env.MYSQL_DATABASE_USERNAME,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  dialect: "mysql",
};