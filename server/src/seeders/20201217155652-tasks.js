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
      "Tasks",
      [
        {
          id: 15,
          lesson_id: 10,
          external_id: "",
          external_link: "",
          created_by: 999999,
          end_date: d,
          type: "manual",
          title: "do homework",
          body: "alone",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 16,
          lesson_id: 10,
          external_id: "",
          external_link: "",
          created_by: 999999,
          end_date: d,
          type: "manual",
          title: "best task",
          body: "together",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 17,
          lesson_id: null,
          external_id: "5a24bbe0dba28a8d3cbd4c5d",
          external_link: "youtube",
          created_by: 999999,
          end_date: d,
          type: "fcc",
          title: "do somethingggg",
          body: "alone",
          status: "disabled",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 19,
          lesson_id: null,
          external_id: "5",
          external_link: "localhost:3000/quizme/5",
          created_by: 999999,
          end_date: new Date('11/12/21'),
          type: "quizMe",
          title: "first week form active",
          body: "welcome to the program",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 20,
          lesson_id: null,
          external_id: "5",
          external_link: "localhost:3000/quizme/5",
          created_by: 999999,
          end_date: new Date('11/12/21'),
          type: "quizMe",
          title: "second week form disabled",
          body: "welcome to the program",
          status: "disabled",
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
    await queryInterface.bulkDelete("Tasks", null, {});
  },
};
