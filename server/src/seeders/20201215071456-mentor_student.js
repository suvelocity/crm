'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
    "Mentor_Students",
    [
      {
        id:1,
        mentor_program_id: 1,
        mentor_id:1,
        student_id:1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // {
      //   id:2,
      //   mentor_program_id: 1,
      //   mentor_id:2,
      //   student_id:8,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   id:3,
      //   mentor_program_id: 1,
      //   mentor_id:3,
      //   student_id:9,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
    ],
    {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Mentor_Students", null, {});
  }
};
