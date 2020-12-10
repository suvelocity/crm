"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Notice, {
        foreignKey: "userId",
      });
      this.hasMany(models.Lesson, {
        foreignKey: "createdBy",
      });
      this.hasMany(models.Task, {
        foreignKey: "createdBy",
      });
    }
  }
  Teacher.init(
    {
      classId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Teacher",
      tableName: "Teachers",
      paranoid: true,
    }
  );
  return Teacher;
};
