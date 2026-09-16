"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Teams", [
      {
        name: "CodeBreakers",
        captain: "Иван Петров",
        members: 4,
        hackathon: "AI Challenge 2026",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "WebWizards",
        captain: "Мария Смирнова",
        members: 5,
        hackathon: "WebDev Cup",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teams", null, {});
  },
};
