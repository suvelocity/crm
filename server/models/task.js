"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Student, {
        foreignKey: "ceatedBy",
      });
      this.belongsTo(models.Lesson, {
        foreignKey: "lessonId",
      });
      this.hasMany(models.TaskofStudent, {
        foreignKey: "taskId",
      });
    }
  }
  Task.init(
    {
      lessonId: DataTypes.INTEGER,
      externalId: DataTypes.INTEGER,
      externalLink: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      endDate: DataTypes.DATE,
      type: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
