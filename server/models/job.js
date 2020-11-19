"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Event, {
        foreignKey: "jobId",
      });
    }
  }
  Job.init(
    {
      position: DataTypes.STRING,
      company: DataTypes.STRING,
      description: DataTypes.STRING,
      contact: DataTypes.STRING,
      location: DataTypes.STRING,
      requirements: DataTypes.STRING,
      additionalDetails: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Job",
      paranoid: true,
      tableName: "jobs",
    }
  );
  return Job;
};
