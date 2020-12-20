'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Mentors", "job"),
      queryInterface.addColumn("Mentors", "role", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Mentors", "experience", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Mentors", "job", {
        type: Sequelize.STRING,
      }),
      queryInterface.removeColumn("Mentors", "role"),
      queryInterface.removeColumn("Mentors", "experience"),
    ]);
  }
};
