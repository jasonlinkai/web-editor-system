// src/database/sequelize.config.js
require('ts-node/register');
console.log('process.env.MYSQL_DATABASE_HOST', process.env.MYSQL_DATABASE_HOST);
console.log('process.env.MYSQL_DATABASE_DATABASE', process.env.MYSQL_DATABASE_DATABASE);
console.log('process.env.MYSQL_DATABASE_USERNAME', process.env.MYSQL_DATABASE_USERNAME);
console.log('process.env.MYSQL_DATABASE_PASSWORD', process.env.MYSQL_DATABASE_PASSWORD);
module.exports = {
  host: process.env.MYSQL_DATABASE_HOST,
  port: Number(process.env.MYSQL_DATABASE_PORT),
  database: process.env.MYSQL_DATABASE_DATABASE,
  username: process.env.MYSQL_DATABASE_USERNAME,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  dialect: "mysql",
};