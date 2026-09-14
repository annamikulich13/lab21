// Глобальный обработчик ошибок.
// ВАЖНО: должен подключаться последним в server.js.
// Сигнатура из 4 аргументов обязательна для Express.
module.exports = (err, req, res, next) => {
  // Ошибки парсинга JSON — вина клиента, не сервера
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ error: "Неверный JSON в теле запроса" });
  }

  // Ошибки доступа к свойствам undefined — тоже вина клиента
  if (err instanceof TypeError) {
    return res.status(400).json({
      error: "Тело запроса отсутствует или имеет неверный формат",
    });
  }

  console.error("❌ Ошибка:", err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
};
