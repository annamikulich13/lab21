const express = require("express");
const app = express();


const teamsRouter = require("./routes/teams");
const tasksRouter = require("./routes/tasks");
const errorHandler = require("./middlewares/errorHandler");


app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use("/teams", teamsRouter);
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.json({
    name: "Hackathon Platform API",
    version: "1.0.0",
    resources: {
      teams: "/teams",
      tasks: "/tasks",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Сервер хакатонов запущен на http://localhost:${PORT}`);
  console.log(` Доступные маршруты:`);
  console.log(`   GET    /                       - информация об API`);
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
