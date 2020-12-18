"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Forms",
      [
        {
          id: 1,
          name: "Sequelize",
          creator_id: 1,
          is_quiz: true
        },
        {
          id: 2,
          name: "Flex-Box",
          creator_id: 1,
          is_quiz: true
        },
        {
          id: 3,
          name: "Class-Components",
          creator_id: 1,
          is_quiz: true
        },
        {
          id: 4,
          name: "SQL",
          creator_id: 1,
          is_quiz: true
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Forms', null, {});
  },
};
