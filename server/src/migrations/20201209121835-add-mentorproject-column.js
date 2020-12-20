'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Classes', // table name
      'mentor_project', // new field name
      {
        type: Sequelize.BOOLEAN,
        defaultValue: 0 ,
      }
    )

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Classes',
      'mentor_project'
    );
  }
};
