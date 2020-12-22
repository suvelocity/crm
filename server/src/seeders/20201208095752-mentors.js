"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Mentors",
      [
        {
          id:1,
          name: "Guy Galil",
          company: "ibm",
          email: "example@gmail.com",
          phone: "1234567890",
          address:"Tel Aviv",
          role: "full stack developer",
          experience: 10,
          gender: "male",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:2,
          name: "Tomer Bab",
          company: "apple",
          email: "example1@gmail.com",
          phone: "123456789",
          address:"Tel Aviv",
          role: "full stack developer",
          experience: 20,
          gender: "male",
          available:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:3,
          name: "Gal Cohen",
          company: "intel",
          email: "example5@gmail.com",
          phone: "1234567890",
          address:"Jerusalem",
          role: "full stack developer",
          experience: 7,
          gender: "female",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:4,
          name: "Yosi Cohen",
          company: "Google",
          email: "example2@gmail.com",
          phone: "1234567890",
          address:"Ashdod",
          role: "full stack developer",
          experience: 15,
          gender: "male",
          available:true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id:5,
          name: "Matan Green",
          company: "Google",
          email: "example6@gmail.com",
          phone: "1234567890",
          address:"Herzelia",
          role: "full stack developer",
          experience: 3,
          gender: "male",
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
