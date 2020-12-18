'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Form, {
        foreignKey: 'formId'
      });
      this.belongsTo(models.FieldType, {
        foreignKey: 'typeId'
      });
      this.belongsToMany(models.Student, {
        through: models.FieldSubmission,
        foreignKey: 'fieldId',
        otherKey: 'studentId'
      });
      this.hasMany(models.Option, {
        foreignKey: 'fieldId'
      });
    }
  };
  Field.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    formId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Field',
  });
  return Field;
};