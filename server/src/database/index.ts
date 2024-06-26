import { Sequelize } from 'sequelize';
import sequelizeConnection from "./connection"
import User from "./models/user";
import Page from "./models/page";
import Meta from "./models/meta";
import Image from "./models/image";

class ServerDatabase {
  public sequelize: Sequelize;
  public userRepository: typeof User;
  public pageRepository: typeof Page;
  public metaRepository: typeof Meta;
  public imageRepository: typeof Image;
  constructor() {
    this.sequelize = sequelizeConnection;
    this.userRepository = User;
    this.pageRepository = Page;
    this.metaRepository = Meta;
    this.imageRepository = Image;
  }
}

export default ServerDatabase;
