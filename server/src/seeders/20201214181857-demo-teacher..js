"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Teachers",
      [
        {
          id: 999999,
          first_name: "lonir",
          last_name: "lotomer",
          email: "teacher@teacher.com",
          class_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete("Teachers", null, {});
  },
};
