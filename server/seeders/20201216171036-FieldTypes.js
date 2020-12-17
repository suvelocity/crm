"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "FieldTypes",
      [
        {
          id: 1,
          name: 'select'
        },
        {
          id: 2,
          name: 'open'
        },
        {
          id: 3,
          name: 'checkbox'
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "FieldTypes",
      null,
      {}
    );
  },
};
