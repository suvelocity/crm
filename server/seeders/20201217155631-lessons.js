"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Lessons",
      [
        {
          id: 10,
          class_id: 1,
          title: "DataTypes.STRING",
          body:
            "lesson description esson description esson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson description",
          resource: "https://www.youtube.com/",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          class_id: 1,
          title: "lesson about things",
          body:
            "lesson description esson description esson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson description",
          resource: "https://www.youtube.com/",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 12,
          class_id: 1,
          title: "lesson about stuff",
          body:
            "lesson description esson description esson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson description",
          resource: "https://www.youtube.com/",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Lessons", null, {});
  },
};
