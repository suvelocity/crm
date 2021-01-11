"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskLabel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Task, {
        foreignKey: "taskId",
      });
    }
  }
  TaskLabel.init(
    {
      taskId: DataTypes.NUMBER,
      label: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TaskLabel",
    }
  );
  return TaskLabel;
};
