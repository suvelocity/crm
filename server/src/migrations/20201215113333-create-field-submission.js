'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FieldSubmissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      field_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      textual_answer: {
        type: Sequelize.STRING,
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
        type: Sequelize.DATE 
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FieldSubmissions');
  }
};