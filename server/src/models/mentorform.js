'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MentorForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.MentorProgram, {
        foreignKey: "programId",
      });
    }
  };
  MentorForm.init({
    programId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    answerUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MentorForm',
    tableName: "Mentor_Forms",
    paranoid: true,
  });
  return MentorForm;
};