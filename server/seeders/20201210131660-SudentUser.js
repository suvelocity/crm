const bcrypt = require("bcryptjs");

("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "student@student.com",
          password: bcrypt.hashSync("student123!", 10),
          type: "student",
          created_at: new Date(),
          updated_at: new Date(),
          related_id: 7,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Users",
      { email: "student@student.com" },
      {}
    );
  },
};
