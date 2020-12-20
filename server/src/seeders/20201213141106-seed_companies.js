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
    await queryInterface.bulkInsert("Companies", [
      {
        id: 1,
        name: "checkpoint",
        contact_name: "Zach Beja",
        contact_number: "0528783109",
        contact_position: "CEO",
        location: "New York, NY, USA",
        description:
          "Looks better, isn’t it? There is one more thing you could do to further enjoy dark mode in Ubuntu. You’ll notice that the websites you visit still have white background. You cannot expect all the websites to provide a dark mode.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Pencils",
        contact_name: "Shahar Eliyahu",
        contact_number: "",
        contact_position: "full stack developer",
        location: "Silicon Valley, CA, USA",
        description:
          "Suppose we want to insert some data into a few tables by default. If we follow up on previous example we can consider creating a demo user for User table.",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Companies", null, {});
  },
};
