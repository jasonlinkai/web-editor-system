import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn("Page", 'ast', {
      allowNull: false,
      type: DataTypes.TEXT("long"),
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.changeColumn("Page", 'ast', {
      allowNull: false,
      type: DataTypes.TEXT,
    });
  },
};
