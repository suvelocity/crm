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
      this.belongsTo(models.Question, {
        foreignKey: 'questionId'
      });
    }
  };
  Field.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }    
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Field',
  });
  return Field;
};