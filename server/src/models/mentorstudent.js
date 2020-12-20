'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MentorStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      this.belongsTo(models.MentorProgram, {
        foreignKey: "mentorProgramId",
      });
      this.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
      this.belongsTo(models.Mentor, {
        foreignKey: "mentorId",
      });
      this.hasMany(models.Meeting, {
        foreignKey: "pairId",
      });

    }
  };
  MentorStudent.init({
    mentorProgramId: DataTypes.INTEGER,
    mentorId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER
  }, {
    sequelize,
      modelName: 'MentorStudent',
      tableName: 'Mentor_Students',
      paranoid: true
  });
  return MentorStudent;
};