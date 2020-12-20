'use strict';
// written here: https://docs.google.com/spreadsheets/d/1IViHzzdPNDrUw3oalhvghBMNRMptSjsnZ1K75NKmxPk/edit#gid=0
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.removeColumn("Events", "student_id"),
      queryInterface.removeColumn("Events", "job_id"),
      queryInterface.removeColumn("Events", "status"),
      queryInterface.removeColumn("Events", "comment"),
      
      queryInterface.addColumn("Events", "event_name",{
        type: Sequelize.STRING(30),
        allowNull: false,
      }),
      queryInterface.addColumn("Events", "type",{
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['jobs', 'courses', 'challengeMe','mentors','fcc',]
      }),
      queryInterface.addColumn("Events", "user_id",{
        allowNull: false,
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("Events", "related_id",{
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("Events", "entry",{
        allowNull: true,
        type: Sequelize.JSON,
      }),
      queryInterface.addColumn("Events", "creator_id",{
        allowNull: false,
        defaultValue:0,
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([
      queryInterface.addColumn("Events", "student_id",{
        allowNull:false,
        type:Sequelize.INTEGER
      }),
      queryInterface.addColumn("Events", "job_id",{
        allowNull:false,
        type:Sequelize.INTEGER
      }),
      queryInterface.addColumn("Events", "status",{
        allowNull:false,
        type:Sequelize.STRING
      }),
      queryInterface.addColumn("Events", "comment",{
        allowNull:false,
        type:Sequelize.STRING
      }),
      
      queryInterface.removeColumn("Events", "event_name"),
      queryInterface.removeColumn("Events", "type"),
      queryInterface.removeColumn("Events", "user_id"),
      queryInterface.removeColumn("Events", "related_id"),
      queryInterface.removeColumn("Events", "entry"),
      queryInterface.removeColumn("Events", "creator_id"),
    ]);
  }
};
