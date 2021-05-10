'use strict';
const { studentSeed } = require('../mocks/studentSeed')
const academicBackgrounds = [];
for (let i = 0; i < studentSeed.length; i++) {
  const student_id = i + 1;
  if (!student_id) continue;
  academicBackgrounds.push({
    average_score: Math.round(80 + Math.random() * 20),
    institution: "אוניברסיטת תל אביב",
    study_topic: "מדעי המחשב",
    degree: "תואר ראשון",
    student_id
  })
  academicBackgrounds.push({
    average_score: Math.round(80 + Math.random() * 20),
    institution: "אוניברסיטת תל אביב",
    study_topic: "פסיכולוגיה",
    degree: "תואר ראשון",
    student_id
  })

}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Academic_Background", academicBackgrounds, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Academic_Background", null, {});
  }
};
