"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.changeColumn("jobs", "description", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("jobs", "requirements", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("jobs", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("classes", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("students", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("students", "military_service", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("students", "work_experience", {
        type: Sequelize.STRING(500),
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
    await Promise.all([
      queryInterface.changeColumn("jobs", "description", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("jobs", "requirements", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("jobs", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("classes", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("students", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("students", "military_service", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("students", "work_experience", {
        type: Sequelize.STRING,
      }),
    ]);
  },
};
