"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Fields",
      [
        {
          id: 1,
          title: "Single-threaded",
          is_correct: true,
          question_id: 1,
        },
        {
          id: 2,
          title: "Multi-threaded",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 3,
          title: "It can be either multi-threaded or single-threaded",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 4,
          title: "None of the above",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 5,
          title: "Phython",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 6,
          title: "PHP",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 7,
          title: "JavaScript",
          is_correct: true,
          question_id: 2,
        },
        {
          id: 8,
          title: "C",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 9,
          title: "Renders a JSX element to the screen",
          is_correct: true,
          question_id: 3,
        },
        {
          id: 10,
          title: "Re-renders the screen",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 11,
          title: "Reloads the page",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 12,
          title: "Compiling the code of the file",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 13,
          title: "The useState hook",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 14,
          title: "The useEffect hook, with an empty dependencies array",
          is_correct: true,
          question_id: 4,
        },
        {
          id: 15,
          title:
            "the return value of the function given in the useEffect's first argument",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 16,
          title:
            "There is no equivalent of componentDidMount in React function component",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 17,
          title: "The order of the elements content within the element",
          is_correct: true,
          question_id: 5,
        },
        {
          id: 18,
          title:
            "The horizontal position of the elements content within the element",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 19,
          title:
            "The vertical position of the elements content within the element",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 20,
          title:
            "the position of the elements content, horizontally or vertically",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 21,
          title:
            "align-items determines the position of the items within the elements, while align-content determines the layout of the rows/columns",
          is_correct: true,
          question_id: 6,
        },
        {
          id: 22,
          title:
            "align-items is responsible of horizontal layout, while align-content is responsible of vertical layout",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 23,
          title:
            "They have the same effect, while align-content is no longer in use",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 24,
          title: "None of the above",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 25,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 26,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 27,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 28,
          title: "asoinasoif",
          is_correct: true,
          question_id: 7,
        },
        {
          id: 29,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 30,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 31,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 32,
          title: "asoinasoif",
          is_correct: true,
          question_id: 8,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Fields",
      [
        {
          id: 1,
          title: "Single-threaded",
          is_correct: true,
          question_id: 1,
        },
        {
          id: 2,
          title: "Multi-threaded",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 3,
          title: "It can be either multi-threaded or single-threaded",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 4,
          title: "None of the above",
          is_correct: false,
          question_id: 1,
        },
        {
          id: 5,
          title: "Phython",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 6,
          title: "PHP",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 7,
          title: "JavaScript",
          is_correct: true,
          question_id: 2,
        },
        {
          id: 8,
          title: "C",
          is_correct: false,
          question_id: 2,
        },
        {
          id: 9,
          title: "Renders a JSX element to the screen",
          is_correct: true,
          question_id: 3,
        },
        {
          id: 10,
          title: "Re-renders the screen",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 11,
          title: "Reloads the page",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 12,
          title: "Compiling the code of the file",
          is_correct: false,
          question_id: 3,
        },
        {
          id: 13,
          title: "The useState hook",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 14,
          title: "The useEffect hook, with an empty dependencies array",
          is_correct: true,
          question_id: 4,
        },
        {
          id: 15,
          title:
            "the return value of the function given in the useEffect's first argument",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 16,
          title:
            "There is no equivalent of componentDidMount in React function component",
          is_correct: false,
          question_id: 4,
        },
        {
          id: 17,
          title: "The order of the elements content within the element",
          is_correct: true,
          question_id: 5,
        },
        {
          id: 18,
          title:
            "The horizontal position of the elements content within the element",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 19,
          title:
            "The vertical position of the elements content within the element",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 20,
          title:
            "the position of the elements content, horizontally or vertically",
          is_correct: false,
          question_id: 5,
        },
        {
          id: 21,
          title:
            "align-items determines the position of the items within the elements, while align-content determines the layout of the rows/columns",
          is_correct: true,
          question_id: 6,
        },
        {
          id: 22,
          title:
            "align-items is responsible of horizontal layout, while align-content is responsible of vertical layout",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 23,
          title:
            "They have the same effect, while align-content is no longer in use",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 24,
          title: "None of the above",
          is_correct: false,
          question_id: 6,
        },
        {
          id: 25,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 26,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 27,
          title: "asoinasoif",
          is_correct: false,
          question_id: 7,
        },
        {
          id: 28,
          title: "asoinasoif",
          is_correct: true,
          question_id: 7,
        },
        {
          id: 29,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 30,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 31,
          title: "asoinasoif",
          is_correct: false,
          question_id: 8,
        },
        {
          id: 32,
          title: "asoinasoif",
          is_correct: true,
          question_id: 8,
        },
      ],
      {}
    );
  },
};
