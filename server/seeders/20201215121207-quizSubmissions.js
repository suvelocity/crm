"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "quiz_submissions",
      [
        {
          id: 1,
          student_id: 1,
          quiz_id: 1,
          rank: 82,
        },
        {
          id: 2,
          student_id: 1,
          quiz_id: 3,
          rank: 91,
        },
        {
          id: 3,
          student_id: 2,
          quiz_id: 1,
          rank: 85,
        },
        {
          id: 4,
          student_id: 2,
          quiz_id: 2,
          rank: 88,
        },
        {
          id: 5,
          student_id: 3,
          quiz_id: 2,
          rank: 94,
        },
        {
          id: 6,
          student_id: 3,
          quiz_id: 3,
          rank: 72,
        },
        {
          id: 7,
          student_id: 4,
          quiz_id: 4,
          rank: 89,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "quiz_submissions",
      [
        {
          id: 1,
          student_id: 1,
          quiz_id: 1,
          rank: 82,
        },
        {
          id: 2,
          student_id: 1,
          quiz_id: 3,
          rank: 91,
        },
        {
          id: 3,
          student_id: 2,
          quiz_id: 1,
          rank: 85,
        },
        {
          id: 4,
          student_id: 2,
          quiz_id: 2,
          rank: 88,
        },
        {
          id: 5,
          student_id: 3,
          quiz_id: 2,
          rank: 94,
        },
        {
          id: 6,
          student_id: 3,
          quiz_id: 3,
          rank: 72,
        },
        {
          id: 7,
          student_id: 4,
          quiz_id: 4,
          rank: 89,
        },
      ],
        {});
  },
};
