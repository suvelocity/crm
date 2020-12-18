"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Teacher, {
        foreignKey: "creatorId"
      });
      this.hasMany(models.Field, {
        foreignKey: "formId",
      });
      // this.hasMany(models.QuizSubmission, {
      //   foreignKey: "quizId",
      // });
      // this.belongsToMany(models.Student, {
      //   through: models.QuizSubmission,
      //   foreignKey: 'quizId',
      //   otherKey: 'studentId'
      // });
    }
  }
  Form.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isQuiz: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      underscored: true,
      modelName: "Form",
      paranoid: true,
    }
  );
  return Form;
};
