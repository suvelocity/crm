'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Student, {
        foreignKey: 'studentId'
      });
      this.belongsTo(models.Quiz, {
        foreignKey: 'quizId'
      });
    }
  };
  QuizSubmission.init({
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    underscored: true,
    modelName: 'QuizSubmission',
    paranoid: true,
    tableName: 'quiz_submissions'
  });
  return QuizSubmission;
};