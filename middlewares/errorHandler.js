
module.exports = (err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ error: "Неверный JSON в теле запроса" });
  }

  if (err instanceof TypeError) {
    return res.status(400).json({
      error: "Тело запроса отсутствует или имеет неверный формат",
    });
  }
  console.error("❌ Ошибка:", err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
};
