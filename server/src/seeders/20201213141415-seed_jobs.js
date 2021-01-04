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

    await queryInterface.bulkInsert("Jobs", [
      {
        id: 1,
        position: "full stack dev",
        description:
          "As developer you will: Take full responsibility for features throughout the whole stack - Server, DB, Client, HTML, CSS. Plan both day-to-day and strategic features with the product team. Have both business and technical perspectives. Ship your work constantly by practicing continuous delivery. ",
        contact: "Nisim - 054545454",
        location: "Tokyo, Japan",
        requirements:
          "2+ years working experience as a web developer with the following: A modern JS framework ( React / Redux - advantage ) HTML & CSS Backend development ( Ruby on Rails - advantage ) SQL Passion for software craftsmanship Mature software design skills Coding standards in place Ability to plan and lead complex features end to end Strong analytical skills Fast learner Doer Team player ",
        additional_details:
          "I built Favicon.io because creating a favicon should be a simple process. No other favicon generator or favicon creator can make a well designed favicon from text. If you like favicon.io or have a suggestion feel free to say hello. Feedback is much appreciated!",
        created_at: new Date(),
        updated_at: new Date(),
        company_id: 1,
      },
      {
        id: 2,
        position: "full stack dev",
        description:
          "Dark mode is getting popular these days even among the non-coders. Turning on the dark mode is on my list of first few things to do after installing Ubuntu 20.04. With these tips, you can satisfy your craving of dark mode in Ubuntu.",
        contact: "Zach Beja, 056-786-3431",
        location: "London, UK",
        requirements:
          "Computers are used as control systems for a wide variety of industrial and consumer devices. This includes simple special purpose devices like microwave ovens and remote controls, factory devices such as industrial robots and computer-aided design, and also general purpose devices like personal computers and mobile devices such as smartphones. The Internet is run on computers and it connects hundreds of millions of other computers and their users.",
        additional_details:
          'These programs enable computers to perform an extremely wide range of tasks. A "complete" computer including the hardware, the operating system (main software), and peripheral equipment required and used for "full" operation can be referred to as a computer system. This term may as well be used for a group of computers that are connected and work together, in particular a computer network or computer cluster.',
        created_at: new Date(),
        updated_at: new Date(),
        company_id: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Jobs", null, {});
  },
};
