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

    await queryInterface.bulkInsert(
      "Classes",
      [
        {
          id: 5,
          course: "Excellentteam",
          name: "An excellent team",
          starting_date: new Date(),
          ending_date: new Date(),
          cycle_number: 1,
          zoom_link: "dsfsdf",
          additional_details: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          course: "Cyber4s",
          name: "A cyber force",
          starting_date: "2020-07-01",
          ending_date: "2020-12-30",
          cycle_number: 1,
          zoom_link: "https://sncentral.zoom.us/j/99857324080#success",
          additional_details: "",
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
    await queryInterface.bulkDelete("Classes", null, {});
  },
};
