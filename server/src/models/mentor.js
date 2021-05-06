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
      this.hasMany(models.MentorStudent,{
        foreignKey: "mentorId",
        onDelete: "cascade",
        hooks: true,
      });
    }
  };
  Mentor.init({
    name: DataTypes.STRING,
    company: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    experience: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    preference: DataTypes.STRING,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    additional: DataTypes.STRING,
    mentoringExperience: DataTypes.STRING,
    agreedTo: DataTypes.STRING,
    gender: DataTypes.STRING,
    religionLevel: DataTypes.STRING,
    education: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Mentor',
    tableName: "Mentors",
    paranoid: true,
  });
  return Mentor;
};