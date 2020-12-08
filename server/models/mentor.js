'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Meeting,{
        foreignKey: "mentorId"   
      });
      this.hasMany(models.Student,{
        foreignKey: "studentId"   
      });
    }
  };
  Mentor.init({
    name: DataTypes.STRING,
    company: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    job: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mentor',
    tableName: "Mentors",
    paranoid: true,
  });
  return Mentor;
};