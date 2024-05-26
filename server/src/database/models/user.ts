import { DataTypes } from "sequelize";
import { Table, Column, Model, AllowNull, HasMany } from "sequelize-typescript";
import { Page } from "./page";

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
  avatarUrl!: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  googleId!: string;

  @HasMany(() => Page)
  pages!: Page[];
}
