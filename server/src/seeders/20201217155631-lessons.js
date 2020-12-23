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
          class_id: 6,
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
          class_id: 6,
          title: "lesson about stuff",
          body:
            "lesson description esson description esson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson descriptionesson description",
          resource: "https://www.youtube.com/",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 13,
          class_id: 6,
          title: "React lesson",
          body:
            "As you can see, accessing the updated book is still a little tricky. I have destructured what update is returning so I can easily access the updated book because it is within an array that’s within an array.Now we can update an entry in the database and easily access the updated book afterwards. If you have any questions or want to commiserate over the Sequelize documentation, email me (sarahherr02@gmail.com)!",
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
