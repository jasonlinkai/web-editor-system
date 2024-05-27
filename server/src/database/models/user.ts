import { Model, DataTypes } from 'sequelize';
import connection from '../connection'

interface UserAttributes {
  id?: number;
  username: string;
  avatarUrl: string;
  email: string;
  googleId: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public avatarUrl!: string;
  public email!: string;
  public googleId!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
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
    modelName: 'User',
  }
);

export default User;