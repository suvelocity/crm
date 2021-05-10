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
      this.belongsTo(models.Teacher, {
        foreignKey: "createdBy",
      });
      this.belongsTo(models.Lesson, {
        foreignKey: "lessonId",
      });
      this.hasMany(models.TaskofStudent, {
        foreignKey: "taskId",
      });
      this.hasMany(models.TaskLabel, {
        foreignKey: "taskId",
      });
      this.hasMany(models.Criterion, {
        foreignKey: "taskId",
      });
      this.hasMany(models.Grade, {
        foreignKey: "belongsToId",
      });
    }
  }
  Task.init(
    {
      lessonId: DataTypes.INTEGER,
      externalId: DataTypes.STRING,
      externalLink: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      endDate: DataTypes.DATE,
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      status: DataTypes.STRING,
      feedbackCount: DataTypes.TEXT,
      totalRank: DataTypes.INTEGER,
      rankCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Tasks",
      paranoid: true,
    }
  );
  return Task;
};
