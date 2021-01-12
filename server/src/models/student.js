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
        foreignKey: "userId",
        onDelete: "cascade",
        hooks: true,
      });
      this.hasMany(models.TaskofStudent, {
        foreignKey: "studentId",
      });
      this.hasMany(models.MentorStudent, {
        foreignKey: "studentId",
        onDelete: "cascade",
        hooks: true,
      });
      this.hasMany(models.User, {
        foreignKey: "relatedId",
      });
      this.belongsTo(models.Mentor, {
        foreignKey: "mentorId",
      });
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
      this.hasMany(models.FieldSubmission, {
        foreignKey: 'studentId'
      });
      this.hasMany(models.AcademicBackground, {
        foreignKey: 'studentId'
      });
      this.belongsToMany(models.Field, {
        through: models.FieldSubmission,
        foreignKey: 'studentId',
        otherKey: 'fieldId'
      })
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
      militaryService: DataTypes.STRING,
      workExperience: DataTypes.STRING,
      languages: DataTypes.STRING,
      citizenship: DataTypes.STRING,
      additionalDetails: DataTypes.STRING,
      classId: DataTypes.INTEGER,
      mentorId: DataTypes.INTEGER,
      fccAccount: DataTypes.STRING,
      resumeLink: DataTypes.STRING,
      cmUser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Student",
      paranoid: true,
      tableName: "Students",
    }
  );
  return Student;
};
