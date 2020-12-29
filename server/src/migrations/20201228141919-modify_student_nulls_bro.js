"use strict";

const { number } = require("joi");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.changeColumn("Students", "age", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn("Students", "phone", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Students", "academic_background", {
        type: Sequelize.STRING(500),
        allowNull: false,
      }),
      queryInterface.changeColumn("Students", "marital_status", {
        type: Sequelize.STRING(20),
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    Promise.all([
      queryInterface.changeColumn("Students", "age", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.changeColumn("Students", "phone", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Students", "academic_background", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Students", "marital_status", {
        type: Sequelize.STRING(20),
      }),
    ]);
  },
};
