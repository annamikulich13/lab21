import { useState } from "react";
import axios from "axios";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      alert("Регистрация успешна! Теперь войдите.");
      onSwitchToLogin(); // переключаем обратно на форму входа
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Регистрация</h2>
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
        <button type="submit" className="btn btn-primary">
          Зарегистрироваться
        </button>
      </form>
      {error && <p className="error-message">Ошибка: {error}</p>}

      <div className="guest-divider">
        <span>или</span>
      </div>
      <button
        className="btn btn-secondary full-width"
        onClick={onSwitchToLogin}
        type="button"
      >
        Уже есть аккаунт? Войти
      </button>
    </div>
  );
}
