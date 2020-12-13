const bcrypt = require("bcryptjs");

("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "teacher@teacher.com",
          password: bcrypt.hashSync("teacher123!", 10),
          type: "teacher",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "People",
      { email: "teacher@teacher.com" },
      {}
    );
  },
};
