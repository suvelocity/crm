'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.MentorStudent, {
        foreignKey: "pairId",
      });
    }
  };
  Meeting.init({
    pairId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    place: DataTypes.STRING,
    title: DataTypes.STRING,
    mentorFeedback: DataTypes.STRING,
    studentFeedback: DataTypes.STRING,
    occurred: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: "Meetings",
    paranoid: true,
  });
  return Meeting;
};