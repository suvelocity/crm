"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Forms",
      [
        {
          id: 5,
          name: "First week form",
          creator_id: 999999
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Forms', null, {});
  },
};
