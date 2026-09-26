const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// POST /auth/register
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Валидация
  if (!email || !password) {
    return res.status(400).json({
      error: "Необходимо указать email и password",
    });
  }

  // Проверка уникальности email
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({
      error: "Пользователь с таким email уже существует",
    });
  }

  // Хеширование пароля
  const passwordHash = await bcrypt.hash(password, 10);

  // Создание пользователя
  const user = await User.create({ email, passwordHash });

  // Ответ без хеша пароля
  res.status(201).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
};

// POST /auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Необходимо указать email и password",
    });
  }

  // Поиск пользователя
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // Проверка пароля
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // Генерация JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token });
};

// GET /auth/profile (защищённый)
exports.profile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "email", "createdAt"], // без passwordHash
  });

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  await user.destroy();
  res.status(204).send();
};
