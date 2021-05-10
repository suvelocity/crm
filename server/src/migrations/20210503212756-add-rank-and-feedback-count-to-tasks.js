'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tasks", "feedback_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Tasks", "total_rank", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("Tasks", "rank_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tasks", "feedback_count")
    await queryInterface.removeColumn("Tasks", "total_rank")
    await queryInterface.removeColumn("Tasks", "rank_count")
  }
};
