'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Meetings', // table name
      'pair_id', // new field name
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Meetings',
      'pair_id'
    );
  }
};
