'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Mentors', // table name
      'available', // new field name
      {
        type: Sequelize.BOOLEAN,
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Mentors',
      'available'
    );
  }
};
