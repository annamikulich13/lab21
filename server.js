require("dotenv").config();
const express = require("express");
const app = express();

// ─── Импорт роутеров и middleware ─────────────────────────────
const teamsRouter = require("./routes/teams");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth"); // ← новое
const errorHandler = require("./middlewares/errorHandler");

// ─── Middleware ───────────────────────────────────────────────
// Парсинг JSON-тела запроса — кладёт результат в req.body
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Маршруты ─────────────────────────────────────────────────
app.use("/teams", teamsRouter);
app.use("/tasks", tasksRouter);
app.use("/auth", authRouter); // ← новое

// Корневой маршрут — информация об API
app.get("/", (req, res) => {
  res.json({
    name: "Hackathon Platform API",
    version: "1.1.0", // ← обновили версию
    resources: {
      teams: "/teams",
      tasks: "/tasks",
      auth: "/auth", // ← добавили
    },
  });
});

// ─── 404 для неизвестных маршрутов ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// ─── Глобальный обработчик ошибок (последним!) ────────────────
app.use(errorHandler);

// ─── Запуск сервера ───────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер хакатонов запущен на http://localhost:${PORT}`);
  console.log(`📋 Доступные маршруты:`);
  console.log(`   GET    /                       - информация об API`);

  console.log(`   ─── АУТЕНТИФИКАЦИЯ ───`); // ← новый блок
  console.log(`   POST   /auth/register          - регистрация`);
  console.log(`   POST   /auth/login             - вход (получить JWT)`);
  console.log(`   GET    /auth/profile           - профиль (требует токен)`);

  console.log(`   ─── КОМАНДЫ ───`);
  console.log(`   GET    /teams                  - список команд`);
  console.log(`   GET    /teams/:id              - команда по ID`);
  console.log(`   POST   /teams                  - создать команду`);
  console.log(`   PUT    /teams/:id              - обновить команду`);
  console.log(`   PATCH  /teams/:id              - частично обновить`);
  console.log(`   DELETE /teams/:id              - удалить команду`);

  console.log(`   ─── ЗАДАНИЯ ───`);
  console.log(`   GET    /tasks                  - список заданий`);
  console.log(`   GET    /tasks/:id              - задание по ID`);
  console.log(`   POST   /tasks                  - создать задание`);
  console.log(`   PUT    /tasks/:id              - обновить задание`);
  console.log(`   PATCH  /tasks/:id              - частично обновить`);
  console.log(`   DELETE /tasks/:id              - удалить задание`);
});
