"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tasks", [
      {
        title: "Разработать чат-бота с ИИ",
        description: "Создать Telegram-бота с использованием GPT API",
        difficulty: "medium",
        points: 100,
        hackathon: "AI Challenge 2026",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Сделать SPA на React",
        description: "Одностраничное приложение с авторизацией",
        difficulty: "easy",
        points: 50,
        hackathon: "WebDev Cup",
        priority: "low",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tasks", null, {});
  },
};
