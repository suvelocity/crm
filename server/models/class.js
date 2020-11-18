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
      // define association here
    }
  }
  Class.init(
    {
      course: DataTypes.STRING,
      name: DataTypes.STRING,
      starting_date: DataTypes.DATE,
      ending_date: DataTypes.DATE,
      cycle_number: DataTypes.INTEGER,
      zoom_link: DataTypes.STRING,
      additional_details: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
      paranoid: true,
      tableName: "classes",
    }
  );
  return Class;
};
