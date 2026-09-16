const { Task } = require("../models");

// GET /tasks
exports.getAll = async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

// GET /tasks/:id
exports.getById = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  res.json(task);
};

// POST /tasks
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
    title,
    description,
    difficulty,
    points,
    hackathon,
  });
  res.status(201).json(task);
};

// PUT /tasks/:id
exports.update = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  const { title, description, difficulty, points, hackathon } = req.body;
  await task.update({ title, description, difficulty, points, hackathon });
  res.json(task);
};

// PATCH /tasks/:id
exports.patch = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  const allowed = ["title", "description", "difficulty", "points", "hackathon"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
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
  await task.destroy();
  res.status(204).send();
};
