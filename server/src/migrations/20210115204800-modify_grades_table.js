"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.renameColumn("Grades", "criterion_id", "belongs_to_id"),
      queryInterface.addColumn("Grades", "student_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn("Grades", "belongs_to", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.renameColumn("Grades", "belongs_to_id", "criterion_id"),
      queryInterface.removeColumn("Grades", "student_id"),
      queryInterface.removeColumn("Grades", "belongs_to"),
    ]);
  },
};
