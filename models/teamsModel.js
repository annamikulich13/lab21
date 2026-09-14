// Хранилище команд в памяти
let teams = [
  {
    id: 1,
    name: "CodeBreakers",
    captain: "Иван Петров",
    members: 4,
    hackathon: "AI Challenge 2026",
  },
  {
    id: 2,
    name: "WebWizards",
    captain: "Мария Смирнова",
    members: 5,
    hackathon: "WebDev Cup",
  },
];

let nextId = 3;

module.exports = {
  // Получить все команды
  getAll: () => teams,

  // Получить команду по ID
  getById: (id) => teams.find((t) => t.id === id),

  // Создать команду
  create: (data) => {
    const team = { id: nextId++, ...data };
    teams.push(team);
    return team;
  },

  // Обновить команду (полностью или частично)
  update: (id, data) => {
    const team = teams.find((t) => t.id === id);
    if (!team) return null;
    Object.assign(team, data);
    return team;
  },

  // Удалить команду
  remove: (id) => {
    const index = teams.findIndex((t) => t.id === id);
    if (index === -1) return false;
    teams.splice(index, 1);
    return true;
  },
};
