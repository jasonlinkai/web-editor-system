import { Table, Column, Model, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { User } from "./user";

@Table({
  timestamps: true,
})
export class Page extends Model {
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
  uuid!: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.JSON,
  })
  ast!: string;

  @ForeignKey(() => User)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
