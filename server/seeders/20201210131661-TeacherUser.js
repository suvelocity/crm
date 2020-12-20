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
<<<<<<< HEAD
      "Users",
=======
      "People",
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
      { email: "teacher@teacher.com" },
      {}
    );
  },
};
