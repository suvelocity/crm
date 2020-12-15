"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Meetings",
      [
        {
          id:1,
          pair_id: 1,
          date: new Date(Date.now() - 10000),
          place: "www.zoom.com",
          created_at: new Date(Date.now() - 10000),
          updated_at: new Date(Date.now() - 10000),
        },
        {
          id:2,
          pair_id: 1,
          date: new Date(),
          place: "www.zoom.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:3,
          pair_id: 1,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:4,
          pair_id: 2,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:5,
          pair_id: 2,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Meetings', null, {});
     
  },
};
