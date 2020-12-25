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
          related_id:1,
          created_at: new Date(),
          updated_at: new Date(),
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
