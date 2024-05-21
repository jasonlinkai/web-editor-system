import { DataTypes } from "sequelize";
import {
  Table,
  Column,
  Model,
  AllowNull,
} from "sequelize-typescript";

@Table({
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  username!: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataTypes.STRING,
  })
  avatar_url!: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  google_id!: string;
}
