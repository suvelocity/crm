'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Mentors", "preference", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Mentors", "religion_level", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Mentors", "education", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Mentors", "age", {
        type: Sequelize.INTEGER,
        allowNull:true
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Mentors", "preference"),
      queryInterface.removeColumn("Mentors", "religion_level"),
      queryInterface.removeColumn("Mentors", "education"),
      queryInterface.removeColumn("Mentors", "age")
    ]);
  }
};
