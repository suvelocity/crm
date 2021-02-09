"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class label extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.TaskLabel, {
        foreignKey: "labelId",
      });
    }
  }
  label.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Label",
      tableName: "Labels",
      paranoid: true,
    }
  );
  return label;
};
