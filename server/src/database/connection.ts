import { Sequelize } from 'sequelize';

const sequelizeConnection: Sequelize = new Sequelize(process.env.MYSQL_DATABASE_DATABASE, process.env.MYSQL_DATABASE_USERNAME, process.env.MYSQL_DATABASE_PASSWORD, {
  host: process.env.MYSQL_DATABASE_HOST,
  port: Number(process.env.MYSQL_DATABASE_PORT), 
  dialect: 'mysql',
});

export default sequelizeConnection;