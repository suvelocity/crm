'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Students', // table name
      'mentor_id', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    )

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Students',
      'mentor_id'
    );
  }
};
