import { Table, Column, Model, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { User } from "./user";

@Table({
  timestamps: true,
})
export class Image extends Model {
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
  url!: string;

  @ForeignKey(() => User)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
