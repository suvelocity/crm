"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Meetings",
      [
        {
          id:1,
          mentor_id: 1,
          student_id: 1,
          date: new Date(Date.now() - 10000),
          place: "www.zoom.com",
          created_at: new Date(Date.now() - 10000),
          updated_at: new Date(Date.now() - 10000),
        },
        {
          id:2,
          mentor_id: 1,
          student_id: 1,
          date: new Date(),
          place: "www.zoom.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:3,
          mentor_id: 3,
          student_id: 3,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:4,
          mentor_id: 3,
          student_id: 3,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:5,
          mentor_id: 4,
          student_id: 5,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:6,
          mentor_id: 4,
          student_id: 5,
          date: new Date(),
          place: "www.zoom33.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:7,
          mentor_id: 4,
          student_id: 5,
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
