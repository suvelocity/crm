"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Meetings", "mentor_id"),
      queryInterface.removeColumn("Meetings", "student_id"),
      queryInterface.addColumn(
        "Meetings", // table name
        "pair_id", // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Meetings", "mentor_id", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("Meetings", "student_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.removeColumn("Meetings", "pair_id"),
    ]);
  },
};
