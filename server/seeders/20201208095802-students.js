"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Students",
      [
        {
          first_name: "John",
          last_name: "Doe",
          id_number: 1,
          email:"example2@gmail.com",
          phone:"1234567890",
          age:23,
          address:"kibbutz shefayim",
          children:0,
          military_service:"p-7",
          languages:"hebrew",
          created_at: new Date(),
          updated_at:new Date(),
          class_id:1,
          mentor_id:1
        },
        {
          first_name: "Dana",
          last_name: 'negev',
          id_number: 2,
          email: "ex@example.com",
          phone: "0545444433",
          age: 21,
          address: "yokneam",
          marital_status: "foo",
          children: 0,
          academic_background: "none",
          military_service: "israeli navy",
          work_experience: "none",
          languages: "Hebrew,english",
          citizenship:"none",
          additional_details:"none",
          created_at:new Date(),
          updated_at:new Date(),
          class_id:1,
          mentor_id:2
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', null, {});
     
  },
};
