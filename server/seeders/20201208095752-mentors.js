"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Mentors",
      [
        {
          name: "Guy Galil",
          company: "ibm",
          email: "example@gmail.com",
          phone: "1234567890",
          address:"Tel Aviv",
          job: "full stack development",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Tomer Bab",
          company: "apple",
          email: "example1@gmail.com",
          phone: "123456789",
          address:"Tel Aviv",
          job: "full stack development",
          available:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Gal Cohen",
          company: "intel",
          email: "example5@gmail.com",
          phone: "1234567890",
          address:"Jerusalem",
          job: "full stack development",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Yosi Cohen",
          company: "Google",
          email: "example2@gmail.com",
          phone: "1234567890",
          address:"Ashdod",
          job: "full stack development",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Matan Green",
          company: "Google",
          email: "example6@gmail.com",
          phone: "1234567890",
          address:"Herzelia",
          job: "full stack development",
          available:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Mentors', null, {});
  },
};
