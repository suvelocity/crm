"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "FieldSubmissions",
      [
        // STUDENT 1
        // Quiz 1
        {
          id: 1,
          student_id: 1,
          field_id: 1,
        },
        {
          id: 2,
          student_id: 1,
          field_id: 2,
        },
        // Quiz 2
        {
          id: 3,
          student_id: 1,
          field_id: 3,
        },
        {
          id: 4,
          student_id: 1,
          field_id: 4,
        },
        // STUDENT 2
        // Quiz 1
        {
          id: 5,
          student_id: 2,
          field_id: 1,
        },
        {
          id: 6,
          student_id: 2,
          field_id: 2,
        },
        // Quiz 3
        {
          id: 7,
          student_id: 2,
          field_id: 5,
        },
        {
          id: 8,
          student_id: 2,
          field_id: 6,
        },
        // STUDENT 3
        // Quiz 2
        {
          id: 9,
          student_id: 3,
          field_id: 3,
        },
        {
          id: 10,
          student_id: 3,
          field_id: 4,
        },
        // Quiz 4
        {
          id: 11,
          student_id: 3,
          field_id: 7,
        },
        {
          id: 12,
          student_id: 3,
          field_id: 8,
        },
        // STUDENT 4
        // Quiz 3
        {
          id: 13,
          student_id: 4,
          field_id: 5,
        },
        {
          id: 14,
          student_id: 4,
          field_id: 6,
        },
        // Quiz 4
        {
          id: 15,
          student_id: 4,
          field_id: 7,
        },
        {
          id: 16,
          student_id: 4,
          field_id: 8,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "FieldSubmissions", null, {});
    }
}
