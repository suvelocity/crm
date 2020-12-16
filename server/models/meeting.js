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
      this.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
      this.belongsTo(models.Mentor, {
        foreignKey: "mentorId",
      });
      this.belongsTo(models.MentorStudent, {
        foreignKey: "pairId",
      });
    }
  };
  Meeting.init({
    mentorId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    pairId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    place: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: "Meetings",
    paranoid: true,
  });
  return Meeting;
};