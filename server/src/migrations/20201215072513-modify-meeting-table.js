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
      queryInterface.addColumn(
        "Meetings", // table name
        "title", // new field name
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        "Meetings", // table name
        "student_feedback", // new field name
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        "Meetings", // table name
        "mentor_feedback", // new field name
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        "Meetings", // table name
        "occurred", // new field name
        {
          type: Sequelize.BOOLEAN,
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
      queryInterface.removeColumn("Meetings", "title"),
      queryInterface.removeColumn("Meetings", "student_feedback"),
      queryInterface.removeColumn("Meetings", "mentor_feedback"),
      queryInterface.removeColumn("Meetings", "occurred"),
    ]);
  },
};
