"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {

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
          starting_date: new Date(),
          ending_date: new Date(),
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
    await queryInterface.bulkDelete("Classes", null, {});
  },
};
