const Team = require("../models/teamsModel");

// GET /teams
exports.getAll = (req, res) => {
  res.json(Team.getAll());
};

// GET /teams/:id
exports.getById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }
  const team = Team.getById(id);
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  res.json(team);
};

// POST /teams
exports.create = (req, res) => {
  const { name, captain, members, hackathon } = req.body;
  if (!name || !captain || members === undefined || !hackathon) {
    return res.status(400).json({
      error: "Необходимо указать: name, captain, members, hackathon",
    });
  }

  const team = Team.create({ name, captain, members, hackathon });
  res.status(201).json(team);
};

// PUT /teams/:id
exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  const { name, captain, members, hackathon } = req.body;
  if (!name || !captain || members === undefined || !hackathon) {
    return res.status(400).json({
      error: "Необходимо указать: name, captain, members, hackathon",
    });
  }

  const team = Team.update(id, { name, captain, members, hackathon });
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  res.json(team);
};

// PATCH /teams/:id
exports.patch = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  const team = Team.getById(id);
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }

  const allowed = ["name", "captain", "members", "hackathon"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  const updated = Team.update(id, updates);
  res.json(updated);
};

// DELETE /teams/:id
exports.remove = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  const ok = Team.remove(id);
  if (!ok) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  res.status(204).send();
};
