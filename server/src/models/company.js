"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Job, {
        foreignKey: "companyId",
      });
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      contactName: DataTypes.STRING,
      contactNumber: DataTypes.STRING,
      contactPosition: DataTypes.STRING,
      location: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
      paranoid: true,
      tableName: "Companies",
    }
  );
  return Company;
};
