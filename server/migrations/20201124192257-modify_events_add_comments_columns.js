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
      queryInterface.addColumn("Events", "comment", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Events", "date", {
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
      queryInterface.removeColumn("Events", "comment"),
      queryInterface.removeColumn("Events", "date"),
    ]);
  },
};
