import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("Meta", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      description: {
        type: new DataTypes.STRING(128),
      },
      keywords: {
        type: new DataTypes.STRING(128),
      },
      author: {
        type: new DataTypes.STRING(128),
      },
      ogTitle: {
        type: new DataTypes.STRING(128),
      },
      ogType: {
        type: new DataTypes.STRING(128),
      },
      ogImage: {
        type: new DataTypes.STRING(128),
      },
      ogUrl: {
        type: new DataTypes.STRING(128),
      },
      ogDescription: {
        type: new DataTypes.STRING(128),
      },
      twitterCard: {
        type: new DataTypes.STRING(128),
      },
      twitterTitle: {
        type: new DataTypes.STRING(128),
      },
      twitterDescription: {
        type: new DataTypes.STRING(128),
      },
      twitterImage: {
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
    await queryInterface.addColumn("Meta", "pageId", {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: "Page",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("Meta");
  },
};
