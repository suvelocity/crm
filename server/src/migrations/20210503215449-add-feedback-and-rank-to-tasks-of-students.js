'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tasks_of_Students", "feedback", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("Tasks_of_Students", "rank", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tasks_of_Students", "feedback")
    await queryInterface.removeColumn("Tasks_of_Students", "rank")
  }
};
