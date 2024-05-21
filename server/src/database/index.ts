require("dotenv").config({ path: [".env.local", ".env"] });
import { Sequelize as _Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Page } from "./models/page";
import { Image } from "./models/image";

class ServerDatabase {
  public sequelize: _Sequelize;
  constructor() {
    this.sequelize = new _Sequelize({
      host: process.env.MYSQL_DATABASE_HOST,
      port: Number(process.env.MYSQL_DATABASE_PORT),
      database: process.env.MYSQL_DATABASE_DATABASE,
      username: process.env.MYSQL_DATABASE_USERNAME,
      password: process.env.MYSQL_DATABASE_PASSWORD,
      models: [User, Page, Image],
      dialect: "mysql",
    });
    
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }
}

export default ServerDatabase;
