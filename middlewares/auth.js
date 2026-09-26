const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Извлекаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Токен не предоставлен" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" → "<token>"

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Неверный или просроченный токен" });
  }
};
