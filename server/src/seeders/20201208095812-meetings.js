"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Meetings",
      [
        {
          id:1,
          pair_id: 1,
          title:"היכרות",
          date: new Date(Date.now() - 10000),
          place: "www.zoom.com",
          created_at: new Date(Date.now() - 10000),
          updated_at: new Date(Date.now() - 10000),
        },
        // {
        //   id:2,
        //   pair_id: 1,
        //   title:"מעבר על קורות חיים",
        //   date: new Date(),
        //   place: "www.zoom.com",
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // },
        // {
        //   id:3,
        //   pair_id: 1,
        //   title:"ראיון דמה",
        //   date: new Date(),
        //   place: "www.zoom33.com",
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // },
        // {
        //   id:4,
        //   pair_id: 2,
        //   title:"היכרות",
        //   date: new Date(),
        //   place: "www.zoom33.com",
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // },
        // {
        //   id:5,
        //   pair_id: 2,
        //   title:"סיור במשרד של המנטור",
        //   date: new Date(),
        //   place: "www.zoom33.com",
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Meetings', null, {});
     
  },
};
