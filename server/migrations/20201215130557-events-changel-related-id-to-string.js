'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("Events", "related_id", {
      type: Sequelize.STRING(500),
    })
  },
  
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.changeColumn("Events", "related_id", {
      type: Sequelize.INTEGER,
    })
  }
};
