"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Classes",
      [
        {
          course: "full stack",
          name: "cyber4s",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 1,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          mentor_project:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          course: "full stack",
          name: "cyber4s",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 2,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          mentor_project:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          course: "full stack",
          name: "adva",
          starting_date: new Date("2020-07-05"),
          ending_date: new Date("2020-12-31"),
          cycle_number: 1,
          zoom_link: "www.zoom.com",
          additional_details: "none",
          mentor_project:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          course: "full stack",
          name: "hackeru",
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
