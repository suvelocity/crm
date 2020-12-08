"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Mentors",
      [
        {
          name: "John Doe",
          company: "ibm",
          email: "example@gmail.com",
          phone: "1234567890",
          address:"tel aviv",
          job: "full stack development",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Tomer Bab",
          company: "apple",
          email: "example1@gmail.com",
          phone: "123456789",
          address:"tel aviv",
          job: "full stack development",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Gal Cohen",
          company: "intel",
          email: "example@gmail.com",
          phone: "1234567890",
          address:"natania",
          job: "full stack development",
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
