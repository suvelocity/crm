'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Mentors", "additional", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Mentors", "mentoring_experience", {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn("Mentors", "agreed_to", {
        type: Sequelize.STRING,
        allowNull:true
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
    queryInterface.removeColumn("Mentors", "additional"),
    queryInterface.removeColumn("Mentors", "agreed_to"),
    queryInterface.removeColumn("Mentors", "mentoring_experience")
    ])
  }
};
