'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Field, {
        foreignKey: 'fieldId'
      });
      this.hasMany(models.SelectedOption, {
        foreignKey: 'optionId'
      });
      this.belongsToMany(models.FieldSubmission, {
        through: models.SelectedOption,
        foreignKey: 'optionId',
        otherKey: 'fieldSubmissionId'
      })
    }
  };
  Option.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
    }    
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Option',
    tableName: "Options",
  });
  return Option;
};