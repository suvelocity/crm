"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Task, {
        foreignKey: "lessonId",
      });
      this.belongsTo(models.Student, {
        foreignKey: "ceatedBy",
      });
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
    }
  }
  Lesson.init(
    {
      classId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      resouce: DataTypes.TEXT,
      zoomLink: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lesson",
    }
  );
  return Lesson;
};
