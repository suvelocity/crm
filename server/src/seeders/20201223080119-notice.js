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
      "Notices",
      [
        {
          id: 1,
          class_id: 6,
          type: "important",
          body: "שימו לב שהשיעור מחר מבוטל! לנצל את הזמן לעבוד על הפיינל ",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 1,
          class_id: 6,
          type: "regular",
          body: " חברה התחרות על הבאדג' עדיין קיימת פרס מובטח לזוכהה",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 1,
          class_id: 1,
          type: "regular",
          body: "happy hour on 17:00!!!!!!!!!",
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
    await queryInterface.bulkDelete("Notices", null, {});
  },
};
