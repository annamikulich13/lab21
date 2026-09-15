
let tasks = [
  {
    id: 1,
    title: "Разработать чат-бота с ИИ",
    description: "Создать Telegram-бота с использованием GPT API",
    difficulty: "medium",
    points: 100,
    hackathon: "AI Challenge 2026",
  },
  {
    id: 2,
    title: "Сделать SPA на React",
    description: "Одностраничное приложение с авторизацией",
    difficulty: "easy",
    points: 50,
    hackathon: "WebDev Cup",
  },
];

let nextId = 3;

module.exports = {
  getAll: () => tasks,
  
  getById: (id) => tasks.find((t) => t.id === id),
  
  create: (data) => {
    const task = { id: nextId++, ...data };
    tasks.push(task);
    return task;
  },

  update: (id, data) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, data);
    return task;
  },
  
  remove: (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};
