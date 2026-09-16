const { Team } = require("../models");

// GET /teams
exports.getAll = async (req, res) => {
  const teams = await Team.findAll();
  res.json(teams);
};

// GET /teams/:id
exports.getById = async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  res.json(team);
};

// POST /teams
exports.create = async (req, res) => {
  const { name, captain, members, hackathon } = req.body;
  if (!name || !captain || members === undefined || !hackathon) {
    return res.status(400).json({
      error: "Необходимо указать: name, captain, members, hackathon",
    });
  }
  const team = await Team.create({ name, captain, members, hackathon });
  res.status(201).json(team);
};

// PUT /teams/:id
exports.update = async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  const { name, captain, members, hackathon } = req.body;
  await team.update({ name, captain, members, hackathon });
  res.json(team);
};

// PATCH /teams/:id
exports.patch = async (req, res) => {
  const team = await Team.findByPk(req.params.id);
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
  await team.update(updates);
  res.json(team);
};

// DELETE /teams/:id
exports.remove = async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  if (!team) {
    return res.status(404).json({ error: "Команда не найдена" });
  }
  await team.destroy();
  res.status(204).send();
};
