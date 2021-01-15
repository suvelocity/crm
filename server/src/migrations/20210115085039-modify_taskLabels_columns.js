"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("TaskLabels", "label"),
      queryInterface.addColumn("TaskLabels", "label_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("TaskLabels", "label", {
        type: Sequelize.STRING,
      }),
      queryInterface.removeColumn("TaskLabels", "label_id"),
    ]);
  },
};
