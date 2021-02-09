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
          external_link:
            "https://github.com/suvelocity/f4s-course/tree/master/15-ajax",
          created_by: 999999,
          end_date: d,
          type: "manual",
          title: "pokedex",
          body: "read the description of the given repo! good luck",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 16,
          lesson_id: 11,
          external_id: "",
          external_link:
            "https://github.com/suvelocity/f4s-course/tree/master/26-mongoDB",
          created_by: 999999,
          end_date: d,
          type: "manual",
          title: "mongo",
          body: "together",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 17,
          lesson_id: 10,
          external_id: "",
          external_link: "https://www.freecodecamp.org/learn/",
          created_by: 999999,
          end_date: d,
          type: "manual",
          title: "basic JavaScript",
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
