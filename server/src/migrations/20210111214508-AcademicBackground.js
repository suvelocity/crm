'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Academic_Background', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: false
      },
      study_topic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      degree: {
        type: Sequelize.STRING,
        allowNull: false
      },
      average_score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {},
      },
    });
    await queryInterface.removeColumn("Students", "academic_background");
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      // queryInterface.addColumn("Students", "academic_background"),
      queryInterface.dropTable('Academic_Background')
    ]);
  }
};
