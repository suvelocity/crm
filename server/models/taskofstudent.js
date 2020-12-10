"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskofStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Student, {
        foreignKey: "userId",
      });
      this.belongsTo(models.Task, {
        foreignKey: "taskId",
      });
    }
  }
  TaskofStudent.init(
    {
      userId: DataTypes.INTEGER,
      taskId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TaskofStudent",
    }
  );
  return TaskofStudent;
};