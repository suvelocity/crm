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
          phone: "054-334-6767",
          id_number: "311711087",
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
