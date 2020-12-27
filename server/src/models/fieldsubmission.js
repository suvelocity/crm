'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FieldSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Student, {
        foreignKey: 'studentId'
      });
      this.belongsTo(models.Field, {
        foreignKey: 'fieldId',
        as: 'field'
      });
      // this.belongsToMany(models.Option, {
      //   through: models.SelectedOption,
      //   foreignKey: 'fieldSubmissionId',
      //   otherKey: 'optionId',
      // })
      this.hasMany(models.SelectedOption, {
        foreignKey: 'fieldSubmissionId',
        sourceKey:'id'
      });
    }
  };
  FieldSubmission.init({
    id: {
      primaryKey:true,
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    textualAnswer: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'FieldSubmission',
    paranoid: true,
    tableName: 'FieldSubmissions'
  });
  return FieldSubmission;
};