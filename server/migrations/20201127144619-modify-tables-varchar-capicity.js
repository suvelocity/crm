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
      queryInterface.changeColumn("Jobs", "description", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Jobs", "requirements", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Jobs", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Classes", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Students", "additional_details", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Students", "military_service", {
        type: Sequelize.STRING(500),
      }),
      queryInterface.changeColumn("Students", "work_experience", {
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
      queryInterface.changeColumn("Jobs", "description", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Jobs", "requirements", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Jobs", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Classes", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Students", "additional_details", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Students", "military_service", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Students", "work_experience", {
        type: Sequelize.STRING,
      }),
    ]);
  },
};
