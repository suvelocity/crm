"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "SelectedOptions",
      [
        // STUDENT 1
        // Quiz 1
        {
          id: 1,
          field_submission_id: 1,
          option_id: 1,
        },
        {
          id: 2,
          field_submission_id: 2,
          option_id: 7,
        },
        // Quiz 2
        {
          id: 3,
          field_submission_id: 3,
          option_id: 9,
        },
        {
          id: 4,
          field_submission_id: 4,
          option_id: 14,
        },
        // STUDENT 2
        // Quiz 1
        {
          id: 5,
          field_submission_id: 5,
          option_id: 1,
        },
        {
          id: 6,
          field_submission_id: 6,
          option_id: 5,
        },
        // Quiz 3
        {
          id: 7,
          field_submission_id: 7,
          option_id: 17,
        },
        {
          id: 8,
          field_submission_id: 8,
          option_id: 21,
        },
        // STUDENT 3
        // Quiz 2
        {
          id: 9,
          field_submission_id: 9,
          option_id: 9,
        },
        {
          id: 10,
          field_submission_id: 10,
          option_id: 13,
        },
        // Quiz 4
        {
          id: 11,
          field_submission_id: 11,
          option_id: 26,
        },
        {
          id: 12,
          field_submission_id: 12,
          option_id: 30,
        },
        // STUDENT 4
        // Quiz 3
        {
          id: 13,
          field_submission_id: 13,
          option_id: 17,
        },
        {
          id: 14,
          field_submission_id: 14,
          option_id: 21,
        },
        // Quiz 4
        {
          id: 15,
          field_submission_id: 15,
          option_id: 26,
        },
        {
          id: 16,
          field_submission_id: 16,
          option_id: 30,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "SelectedOptions",
      null,
      {}
    );
  },
};
