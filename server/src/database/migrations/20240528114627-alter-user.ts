import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn("Users", "uuid", {
      allowNull: false,
      type: new DataTypes.STRING(128),
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.removeColumn('Users', 'age');
  },
};
