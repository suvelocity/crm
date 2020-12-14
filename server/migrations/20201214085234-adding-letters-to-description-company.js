"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Companies", "description", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Companies", "description", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
