require("dotenv").config({ path: [".env.local", ".env"] });
import { Sequelize as _Sequelize, Repository } from "sequelize-typescript";
import { User } from "./models/user";
import { Page } from "./models/page";
import { Image } from "./models/image";

const retry = {
  match: [
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/,
  ],
  name: "query",
  backoffBase: 100,
  backoffExponent: 1.1,
  timeout: 3000,
  max: 3,
};

class ServerDatabase {
  public sequelize: _Sequelize;
  public userRepository: Repository<User>;
  public pageRepository: Repository<Page>;
  public imageRepository: Repository<Image>;
  constructor() {
    this.sequelize = new _Sequelize({
      host: process.env.MYSQL_DATABASE_HOST,
      port: Number(process.env.MYSQL_DATABASE_PORT),
      database: process.env.MYSQL_DATABASE_DATABASE,
      username: process.env.MYSQL_DATABASE_USERNAME,
      password: process.env.MYSQL_DATABASE_PASSWORD,
      models: [User, Page, Image],
      dialect: "mysql",
      retry,
    });
    this.userRepository = this.sequelize.getRepository(User);
    this.pageRepository = this.sequelize.getRepository(Page);
    this.imageRepository = this.sequelize.getRepository(Image);
  }
  async sync() {
    try {
      console.log('Start sync db...');
      // await this.sequelize.sync({ force: true });
      console.log("Sync db success!");
    } catch (e) {
      console.error("Sync db error:", e);
    }
  }
  async connect() {
    try {
      console.log('Start connect db...');
      await this.sequelize.authenticate({
        retry,
      });
      console.log("Connection has been established successfully.");
    } catch (e) {
      console.error("Unable to connect to the database:", e);
    }
  }
}

export default ServerDatabase;
