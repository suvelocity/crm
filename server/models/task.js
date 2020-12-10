'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Task.init({
    classId: DataTypes.INTEGER,
    lessonId: DataTypes.INTEGER,
    externalId: DataTypes.INTEGER,
    externalLink: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    endDate: DataTypes.DATE,
    type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};