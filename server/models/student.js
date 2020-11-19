"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Event, {
        foreignKey: "classId",
      });
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
    }
  }
  Student.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      idNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      age: DataTypes.INTEGER,
      address: DataTypes.STRING,
      maritalStatus: DataTypes.STRING,
      children: DataTypes.INTEGER,
      academicBackground: DataTypes.STRING,
      militaryService: DataTypes.STRING,
      workExperience: DataTypes.STRING,
      languages: DataTypes.STRING,
      citizenship: DataTypes.STRING,
      additionalDetails: DataTypes.STRING,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student",
      paranoid: true,
      tableName: "students",
    }
  );
  return Student;
};
