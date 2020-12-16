"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Quizzes",
      [
        {
          id: 1,
          name: "Sequelize",
          creator_id: 1
        },
        {
          id: 2,
          name: "Flex-Box",
          creator_id: 1
        },
        {
          id: 3,
          name: "Class-Components",
          creator_id: 1
        },
        {
          id: 4,
          name: "SQL",
          creator_id: 1
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Quizzes",
      [
        {
          id: 1,
          name: "Sequelize",
          creator_id: 1
        },
        {
          id: 2,
          name: "Flex-Box",
          creator_id: 1
        },
        {
          id: 3,
          name: "Class-Components",
          creator_id: 1
        },
        {
          id: 4,
          name: "SQL",
          creator_id: 1
        },
      ],
      {}
    );
  },
};
