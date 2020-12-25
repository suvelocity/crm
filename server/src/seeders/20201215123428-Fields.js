"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Fields",
      [
        {
          id: 1,
          title: "Is Node.js single/multi threaded?",
          form_id: 1,
          type_id:1
        },
        {
          id: 2,
          title: "What language does Node run?",
          form_id: 1,
          type_id:1
        },
        {
          id: 3,
          title: "What does the render() method do?",
          form_id: 2,
          type_id:1
        },
        {
          id: 4,
          title:
            "What is the equivalent of componentDidMount in a React function component?",
          form_id: 2,
          type_id:1
        },
        {
          id: 5,
          title: "What does the 'justify-content' property responsible of?",
          form_id: 3,
          type_id:1
        },
        {
          id: 6,
          title:
            "What is the difference between 'align-items' to 'align-content'?",
          form_id: 3,
          type_id:1
        },
        {
          id: 7,
          title: "What is the main advantage of a relational Database?",
          form_id: 4,
          type_id:1
        },
        {
          id: 8,
          title: "When would you want to create an index constraint?",
          form_id: 4,
          type_id:1
        },
        {
          id: 9,
          title: "How did you feel in this first week of the course?",
          form_id: 5,
          type_id:1
        }
        {
          id: 10,
          title: "What were your first impressions of the course?",
          form_id: 5,
          type_id:2
        },
        {
          id: 11,
          title: "What are your expectations from this course?",
          form_id: 5,
          type_id:1
        },
        {
          id: 12,
          title: "What colors do you like?",
          form_id: 5,
          type_id:3
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Fields",
      null,
      {}
    );
  },
};
