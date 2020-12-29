"use strict";
//999999

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:

    */
    await queryInterface.bulkInsert(
      "Teachers_of_Classes",
      [
        {
          teacher_id: 999999,
          class_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          teacher_id: 999999,
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
    await queryInterface.bulkDelete("Teachers_of_Classes", null, {});
  },
};
