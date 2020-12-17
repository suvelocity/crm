"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "Tasks_of_Students",
      "user_id",
      "student_id"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "Tasks_of_Students",
      "student_id",
      "user_id"
    );
  },
};
