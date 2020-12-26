'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Tasks','type',{
      type: Sequelize.ENUM,
      values: ['challengeMe','quizMe','fcc','manual','codeReview']
    })
  },
  
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Tasks','type',{
      type: Sequelize.STRING,
    })
  }
};
