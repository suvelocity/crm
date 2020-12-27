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
      queryInterface.addColumn(
        'Teachers', // table name
        'phone', // new field name
        {
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Teachers',
        'id_number',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      )
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
      queryInterface.removeColumn('Teachers', 'phone'),
      queryInterface.removeColumn('Teachers', 'id_number')
    ]);
  }
};