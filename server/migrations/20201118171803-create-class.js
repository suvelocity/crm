"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      starting_date: {
        allowNull: false,

        type: Sequelize.DATE,
      },
      ending_date: {
        allowNull: false,

        type: Sequelize.DATE,
      },
      cycle_number: {
        allowNull: false,

        type: Sequelize.INTEGER,
      },
      zoom_link: {
        type: Sequelize.STRING,
      },
      additional_details: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {},
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Classes");
  },
};
