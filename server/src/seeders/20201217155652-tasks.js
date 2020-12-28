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
          lesson_id: 11,
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
          lesson_id: 10,
          external_id: "5a24bbe0dba28a8d3cbd4c5d",
          external_link: "https://www.freecodecamp.org/learn/",
          created_by: 999999,
          end_date: d,
          type: "fcc",
          title: "do somethingggg",
          body: "alone",
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
