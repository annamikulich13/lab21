const Task = require("../models/tasksModel");

// GET /tasks
exports.getAll = (req, res) => {
  res.json(Task.getAll());
};

// GET /tasks/:id
exports.getById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }
  const task = Task.getById(id);
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  res.json(task);
};

// POST /tasks
exports.create = (req, res) => {
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

  const task = Task.create({
    title,
    description,
    difficulty,
    points,
    hackathon,
  });
  res.status(201).json(task);
};

// PUT /tasks/:id
exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

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

  const task = Task.update(id, {
    title,
    description,
    difficulty,
    points,
    hackathon,
  });
  if (!task) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  res.json(task);
};

// PATCH /tasks/:id
exports.patch = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  const task = Task.getById(id);
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

  const updated = Task.update(id, updates);
  res.json(updated);
};

// DELETE /tasks/:id
exports.remove = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  const ok = Task.remove(id);
  if (!ok) {
    return res.status(404).json({ error: "Задание не найдено" });
  }
  res.status(204).send();
};
