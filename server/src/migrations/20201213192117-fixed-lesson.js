"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Lessons", "resouce", "resource");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Lessons", "resource", "resouce");
  },
};
