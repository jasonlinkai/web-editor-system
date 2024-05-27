import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      url: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(128),
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
    await queryInterface.addColumn("Images", "userId", {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("Images");
  },
};
