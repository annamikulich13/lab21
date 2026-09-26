const { Task } = require("../models");

exports.getAll = async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

exports.getById = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  res.json(task);
};

exports.create = async (req, res) => {
  const { title, description, difficulty, points, hackathon } = req.body;
  if (
    !title ||
    !description ||
    !difficulty ||
    points === undefined ||
    !hackathon
  ) {
    return res.status(400).json({
      error:
        "Необходимо указать: title, description, difficulty, points, hackathon",
    });
  }
  const task = await Task.create({
    //вставляет запись в табл
    title,
    description,
    difficulty,
    points,
    hackathon,
  });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  const { title, description, difficulty, points, hackathon } = req.body;
  await task.update({ title, description, difficulty, points, hackathon });
  res.json(task);
};

exports.patch = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  const allowed = ["title", "description", "difficulty", "points", "hackathon"];
  const updates = {};
  for (const key of allowed) {
    // цикл по элементам массива
    if (req.body[key] !== undefined) {
      //передан ли этот ключ в req.body.
      updates[key] = req.body[key]; //если передан, копируем в updates
    }
  }
  await task.update(updates);
  res.json(task);
};

// DELETE /tasks/:id
exports.remove = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  await task.destroy(); // ждем ответа от постгрес
  res.status(204).send();
};
