"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const d = new Date();
    await queryInterface.bulkInsert(
      "Tasks_of_Students",
      [
        {
          id: 50,
          student_id: 1,
          task_id: 15,
          type: "manual",
          status: "pending",
          submit_link: "https://www.youtube.com/",
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 51,
          student_id: 1,
          task_id: 16,
          type: "manual",
          status: "done",
          submit_link: "https://www.youtube.com/",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 52,
          student_id: 2,
          task_id: 15,
          type: "manual",
          status: "pending",
          submit_link: "https://www.youtube.com/",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 53,
          student_id: 2,
          task_id: 16,
          type: "manual",
          status: "pending",
          submit_link: "https://www.youtube.com/",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 54,
          student_id: 7,
          task_id: 17,
          type: "fcc",
          status: "pending",
          submit_link: "https://www.youtube.com/",
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
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Tasks_of_Students", null, {});
  },
};
