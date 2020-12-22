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

    await queryInterface.bulkInsert("Students", [
      {
        id: 7,
        first_name: "Nitzan",
        last_name: "Listman",
        id_number: "123432159",
        email: "student@student.com",
        phone: "0529363490",
        age: 24,
        address: "Tel Mond, Israel",
        marital_status: "Single",
        children: 0,
        academic_background: ".",
        military_service: "Combat intelligence",
        work_experience: ".",
        languages: "Hebrew",
        citizenship: "Israeli",
        additional_details: ".",
        class_id: 6,
        fcc_account: "nitzo",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        first_name: "Amir",
        last_name: "Debbie",
        id_number: "746564354",
        email: "cyybrp@gmail.com",
        phone: "0508392471",
        age: 22,
        address: "Herzliya, Israel",
        marital_status: "Married",
        children: 2,
        academic_background: ".",
        military_service: "Combat intelligence",
        work_experience: ".",
        languages: "Albanian,Azerbaijani",
        citizenship: "Israeli",
        additional_details: ".",
        class_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        first_name: "Shahar",
        last_name: "Eliyahu",
        id_number: "123456789",
        email: "snake@gmail.com",
        phone: "0508392471",
        age: 22,
        address: "Modiin, Modi'in-Maccabim-Re'ut, Israel",
        marital_status: "Single",
        children: 0,
        academic_background: ".",
        military_service: "Tohanim",
        work_experience: ".",
        languages: "Hebrew, Italian",
        citizenship: "Israeli, American",
        additional_details: ".",
        class_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        first_name: "Zach ",
        last_name: "Beja",
        id_number: "648623580",
        email: "zachirp@gmail.com",
        phone: "0529363490",
        age: 21,
        address: "Modiin, Modi'in-Maccabim-Re'ut, Israel",
        marital_status: "Married",
        children: 15,
        academic_background: ".",
        military_service: "Paratroopers",
        work_experience: ".",
        languages: "Hebrew, English, Spanish",
        citizenship: "Israeli",
        additional_details: ".",
        class_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
      {};
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Students", null, {});
  },
};
