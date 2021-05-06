"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AcademicBackground extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
    }
  }
  AcademicBackground.init(
    {
      studentId: DataTypes.INTEGER,
      institution: DataTypes.STRING,
      studyTopic: DataTypes.STRING,
      degree: DataTypes.STRING,
      averageScore: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AcademicBackground",
      tableName: "Academic_Background",
      paranoid: true,
    }
  );
  return AcademicBackground;
};
