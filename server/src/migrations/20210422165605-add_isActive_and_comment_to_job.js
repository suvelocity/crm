"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Jobs", "is_active", {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      }),
      queryInterface.addColumn("Jobs", "close_comment", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Jobs", "is_active"),
      queryInterface.removeColumn("Jobs", "close_comment"),
    ]);
  },
};
