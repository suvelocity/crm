"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MentorProgram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Class, {
        foreignKey: "classId",
      });
      this.hasMany(models.MentorStudent, {
        foreignKey: "mentorProgramId",
        onDelete: "cascade",
        hooks: true,
      });
      this.hasMany(models.MentorForm, {
        foreignKey: "programId",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  MentorProgram.init(
    {
      classId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      open: DataTypes.BOOLEAN,
      email: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "MentorProgram",
      paranoid: true,
      tableName: "Mentor_Programs",
    }
  );
  return MentorProgram;
};
