'use strict';

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
   await queryInterface.bulkInsert(
    "Mentor_Programs",
    [
      {
        id:1,
        class_id: 1,
        name: "seed M-program" ,
        start_date: new Date(),
        end_date: new Date("2021-05-16"),
        open:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Mentor_Programs", null, {});
  }
};
