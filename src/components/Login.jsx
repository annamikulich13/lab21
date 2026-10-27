import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, onGuest }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email: email.trim(),
        password,
      });
      localStorage.setItem("token", res.data.token);
      // Расшифровываем токен, чтобы достать роль (JWT в формате base64)
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("userRole", payload.role); // сохраняем роль
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <input
          className="full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="full"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
      {error && <p className="error-message">Ошибка: {error}</p>}

      <div className="guest-divider">
        <span>или</span>
      </div>
      <button
        className="btn btn-secondary full-width"
        onClick={onGuest}
        type="button"
      >
        Войти как гость
      </button>
    </div>
  );
}
