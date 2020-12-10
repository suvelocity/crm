"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Student, {
        foreignKey: "classId",
      });
      this.hasMany(models.Teacher, {
        foreignKey: "classId",
      });
      this.hasMany(models.Lesson, {
        foreignKey: "classId",
      });
      this.hasMany(models.Notice, {
        foreignKey: "classId",
      });
    }
  }
  Class.init(
    {
      course: DataTypes.STRING,
      name: DataTypes.STRING,
      startingDate: DataTypes.DATE,
      endingDate: DataTypes.DATE,
      cycleNumber: DataTypes.INTEGER,
      zoomLink: DataTypes.STRING,
      additionalDetails: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
      paranoid: true,
      tableName: "Classes",
    }
  );
  return Class;
};
