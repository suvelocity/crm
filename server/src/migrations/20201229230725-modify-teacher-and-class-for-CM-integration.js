'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.addColumn("Teachers", "cm_user", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Classes", "cm_id", {
        type: Sequelize.STRING,
        allowNull:true
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
      queryInterface.removeColumn("Teachers", "cm_user"),
      queryInterface.removeColumn("Classes", "cm_id")
    ]);
  }
};
