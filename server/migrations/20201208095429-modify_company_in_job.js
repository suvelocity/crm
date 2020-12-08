"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Jobs", "company"),
      queryInterface.addColumn("Jobs", "company_id", {
        allowNull: false,
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Jobs", "company", {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.removeColumn("Jobs", "company_id"),
    ]);
  },
};
