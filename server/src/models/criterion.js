"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class criterion extends Model {
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
      this.belongsTo(models.TaskLabel, {
        foreignKey: "labelId",
      });
      this.hasMany(models.Grade, {
        foreignKey: "criterionId",
      });
    }
  }
  criterion.init(
    {
      taskId: DataTypes.INTEGER,
      labelId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Criterion",
      tableName: "Criteria",
      paranoid: true,
    }
  );
  return criterion;
};
