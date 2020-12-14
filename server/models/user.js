"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Students, {
        foreignKey: "relatedId",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.STRING,
      relatedId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      tableName: "Users",
    }
  );
  return User;
};
