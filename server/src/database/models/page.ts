import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import Meta from "./meta";

interface PageAttributes {
  id?: number;
  uuid: string;
  title: string;
  ast: string;

  userId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class PageModel extends Model<PageAttributes> implements PageAttributes {
  public id!: number;
  public uuid!: string;
  public title!: string;
  public ast!: string;

  public userId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

const Page = PageModel.init(
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
      type: DataTypes.STRING,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ast: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    userId: {
      allowNull: false,
      type: DataTypes.NUMBER,
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
    modelName: "Page",
  }
);
Page.hasOne(Meta, {
  foreignKey: "pageId",
  as: "meta",
});
Meta.belongsTo(Page, {
  foreignKey: "pageId",
  as: "page",
});

export default Page;
