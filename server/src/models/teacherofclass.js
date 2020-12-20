"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeacherofClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
      this.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
      });
    }
  }
  TeacherofClass.init(
    {
      classId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TeacherofClass",
      tableName: "Teachers_of_Classes",
      paranoid: true,
    }
  );
  return TeacherofClass;
};
