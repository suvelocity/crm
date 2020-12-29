"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Teachers",
      [
        {
          id: 999999,
          id_number:123,
          first_name: "lonir",
          last_name: "lotomer",
          email: "teacher@teacher.com",
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
