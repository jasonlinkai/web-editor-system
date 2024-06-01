import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("User", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      uuid: {
        allowNull: false,
        type: new DataTypes.STRING(128),
      },
      username: {
        allowNull: false,
        type: new DataTypes.STRING(128),
      },
      avatarUrl: {
        type: new DataTypes.STRING(128),
      },
      email: {
        allowNull: false,
        type: new DataTypes.STRING(128),
      },
      googleId: {
        unique: true,
        type: new DataTypes.STRING(128),
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("User");
  },
};
