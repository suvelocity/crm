"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Student, {
        foreignKey: "ceatedBy",
      });
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
    }
  }
  Notice.init(
    {
      classId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      body: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notice",
    }
  );
  return Notice;
};
