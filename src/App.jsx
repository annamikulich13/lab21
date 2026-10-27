import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TeamList from "./components/TeamList";
import Tabs from "./components/Tabs";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [tab, setTab] = useState("tasks");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole")); // ← НОВОЕ
  const [guestMode, setGuestMode] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("userRole")); // ← НОВОЕ
  }, []);

  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("userRole")); // ← НОВОЕ
    setGuestMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole"); // ← НОВОЕ
    setToken(null);
    setUserRole(null); // ← НОВОЕ
    setGuestMode(false);
  };

  const handleGuest = () => {
    setGuestMode(true);
  };

  // Если нет токена и не гость — показываем логин или регистрацию
  if (!token && !guestMode) {
    return (
      <div className="App">
        <h1>Хакатон-платформа</h1>
        {showRegister ? (
          <Register
            onRegister={handleLogin}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <>
            <Login onLogin={handleLogin} onGuest={handleGuest} />
            <button
              className="btn btn-secondary full-width"
              style={{ marginTop: "10px" }}
              onClick={() => setShowRegister(true)}
            >
              Создать аккаунт
            </button>
          </>
        )}
      </div>
    );
  }

  // Интерфейс (для админа или гостя)
  return (
    <div className="App">
      <div className="header">
        <div>
          <h1>Хакатон-платформа</h1>
          <p className="subtitle">
            {token && userRole === "admin"
              ? "Вы вошли как администратор — можно менять данные"
              : token
                ? "Вы вошли как пользователь — только просмотр"
                : "Режим гостя — только просмотр"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {guestMode && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setGuestMode(false)}
            >
              Войти
            </button>
          )}
          {token && (
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Выйти
            </button>
          )}
        </div>
      </div>

      <Tabs active={tab} onChange={setTab} />

      {/* Передаем true только если роль - админ */}
      {tab === "tasks" && <TaskList isAuthenticated={userRole === "admin"} />}
      {tab === "teams" && <TeamList isAuthenticated={userRole === "admin"} />}
    </div>
  );
}

export default App;
