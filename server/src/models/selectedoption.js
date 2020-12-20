'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SelectedOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.FieldSubmission, {
        foreignKey: 'fieldSubmissionId'
      });
      this.belongsTo(models.Option, {
        foreignKey: 'optionId'
      });
    }
  };
  SelectedOption.init({
    fieldSubmissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    optionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'SelectedOption',
    tableName: "selectedoptions"
  });
  return SelectedOption;
};