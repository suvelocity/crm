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
        foreignKey: "relatedId",
      });
      this.belongsTo(models.Company, {
        foreignKey: "companyId",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  Job.init(
    {
      position: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      location: DataTypes.STRING,
      requirements: DataTypes.STRING,
      additionalDetails: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      closeComment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Job",
      paranoid: true,
      tableName: "Jobs",
    }
  );
  return Job;
};
