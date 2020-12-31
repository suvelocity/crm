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
          class_id: 6,
          title: "React Native",
          body: "we will learn how to develop applications!",
          resource: "https://youtu.be/dQw4w9WgXcQ?t=42",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          class_id: 6,
          title: "React",
          body:
            "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes Declarative views make your code more predictable and easier to debug",
          resource:
            "https://reactjs.org/%#splitingResource#%https://material-ui.com/components/selects/#select",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 12,
          class_id: 6,
          title: "React hooks",
          body:
            "React doesn’t offer a way to “attach” reusable behavior to a component (for example, connecting it to a store). If you’ve worked with React for a while, you may be familiar with patterns like render props and higher-order components that try to solve this. But these patterns require you to restructure your components when you use them, which can be cumbersome and make code harder to follow. If you look at a typical React application in React DevTools, you will likely find a “wrapper hell” of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions. While we could filter them out in DevTools, this points to a deeper underlying problem: React needs a better primitive for sharing stateful logic.",
          resource: "https://reactjs.org/",
          zoom_link: "zoom",
          created_by: 999999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 13,
          class_id: 6,
          title: "Ajax",
          body:
            "As you can see, accessing the updated book is still a little tricky. I have destructured what update is returning so I can easily access the updated book because it is within an array that’s within an array.Now we can update an entry in the database and easily access the updated book afterwards. If you have any questions or want to commiserate over the Sequelize documentation, email me (sarahherr02@gmail.com)!",
          resource:
            "https://he.wikipedia.org/wiki/AJAX_(%D7%AA%D7%9B%D7%A0%D7%95%D7%AA)",
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
