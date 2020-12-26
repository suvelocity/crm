"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Classes",
      [
        {
          id:1,
          course: "cyber4s",
          name: "summer-2020",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 1,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:2,
          course: "cyber4s ",
          name: "winter-2021",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 2,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:3,
          course: "Execellentteam",
          name: "summer-2020",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 1,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:4,
          course: "Adva",
          name: "winter-2020",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 1,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Classes', null, {});
  },
};
