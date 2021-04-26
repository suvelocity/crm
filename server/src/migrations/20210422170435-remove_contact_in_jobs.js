"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Jobs", "contact");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Jobs", "contact", {
      type: Sequelize.STRING,
    });
  },
};
