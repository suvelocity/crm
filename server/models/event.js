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
        foreignKey: "relatedId",
        onDelete: "cascade",
        hooks: true,
      });
      this.belongsTo(models.Student, {
        foreignKey: "userId",
      });
    }
  }
  Event.init(
    {
      eventName: DataTypes.STRING,
      type: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      relatedId: DataTypes.INTEGER,
      entry: DataTypes.JSON,
      creatorId: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "Events",
      paranoid: true,
    }
  );
  return Event;
};
