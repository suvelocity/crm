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
        foreignKey: "createdBy",
      });
      this.hasMany(models.Lesson, {
        foreignKey: "createdBy",
      });
      this.hasMany(models.Task, {
        foreignKey: "createdBy",
      });
      this.hasMany(models.TeacherofClass, {
        foreignKey: "teacherId",
        as: 'Classes'
      });
      this.hasMany(models.Form, {
        foreignKey: 'creatorId'
      });
    }
  }
  Teacher.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      idNumber: DataTypes.STRING,
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
