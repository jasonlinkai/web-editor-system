import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import Page from "./page";
import Image from "./image";

interface UserAttributes {
  id?: number;
  uuid: string;
  username: string;
  avatarUrl: string;
  email: string;
  googleId: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public uuid!: string;
  public username!: string;
  public avatarUrl!: string;
  public email!: string;
  public googleId!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

const User = UserModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    uuid: {
      allowNull: false,
      unique: true,
      type: new DataTypes.STRING(128),
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    googleId: {
      unique: true,
      type: DataTypes.STRING,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: "User",
  }
);
User.hasMany(Page, { foreignKey: "userId", as: "page" });
Page.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(Image, { foreignKey: "userId", as: "image" });
Image.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default User;
