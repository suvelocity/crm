"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Criterion, {
        foreignKey: "belongsToId",
      });
      this.belongsTo(models.Task, {
        foreignKey: "belongsToId",
      });
      this.belongsTo(models.TaskLabel, {
        foreignKey: "belongsToId",
      });
      this.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
    }
  }
  grade.init(
    {
      grade: DataTypes.INTEGER,
      belongsToId: DataTypes.INTEGER,
      belongsTo: DataTypes.STRING,
      studentId: DataTypes.INTEGER,
      freeText: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Grade",
      tableName: "Grades",
      paranoid: true,
    }
  );
  return grade;
};
