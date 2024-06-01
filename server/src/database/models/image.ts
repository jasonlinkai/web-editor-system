import { Model, DataTypes } from 'sequelize';
import connection from '../connection'

interface ImageAttributes {
  id?: number;
  url: string;

  userId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class ImageModel extends Model<ImageAttributes> implements ImageAttributes {
  public id!: number;
  public url!: string;

  public userId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

const Image = ImageModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    url: {
      allowNull: false,
      unique: true,
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
    modelName: 'Image',
  }
);

export default Image;