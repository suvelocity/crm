"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tasklabel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Task, {
        foreignKey: "taskId",
      });
      this.belongsTo(models.Label, {
        foreignKey: "labelId"
      });
      this.hasMany(models.Criterion, {
        foreignKey: "labelId"
      })
      this.hasMany(models.Grade, {
        foreignKey: "belongsToId"
      })
    }
  }
  tasklabel.init(
    {
      taskId: DataTypes.NUMBER,
      labelId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TaskLabel",
      tableName: "TaskLabels",
      paranoid: true,
    }
  );
  return tasklabel;
};
