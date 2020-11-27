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
      queryInterface.addColumn("events", "comment", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("events", "date", {
        type: Sequelize.DATE,
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
      queryInterface.removeColumn("events", "comment"),
      queryInterface.removeColumn("events", "date"),
    ]);
  },
};
