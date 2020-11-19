"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Job, {
        foreignKey: "jobId",
        onDelete: "cascade",
        hooks: true,
      });
      this.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
    }
  }
  Event.init(
    {
      studentId: DataTypes.INTEGER,
      jobId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "events",
      paranoid: true,
    }
  );
  return Event;
};
