"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Quizzes",
      [
        {
          id: 1,
          name: "Sequelize",
          created_by: 1
        },
        {
          id: 2,
          name: "Flex-Box",
          created_by: 1
        },
        {
          id: 3,
          name: "Class-Components",
          created_by: 1
        },
        {
          id: 4,
          name: "SQL",
          created_by: 1
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
          created_by: 1
        },
        {
          id: 2,
          name: "Flex-Box",
          created_by: 1
        },
        {
          id: 3,
          name: "Class-Components",
          created_by: 1
        },
        {
          id: 4,
          name: "SQL",
          created_by: 1
        },
      ],
      {}
    );
  },
};
