'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Mentor_Programs', // table name
      'email', // new field name
      {
        type: Sequelize.BOOLEAN
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Mentor_Programs', 'email')
  }
};
