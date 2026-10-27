import { useState, useEffect, useMemo } from "react";
import { fetchTeams, createTeam, updateTeam, deleteTeam } from "../api";

const HACKATHONS = ["AI Challenge 2026", "WebDev Cup", "Mobile Cup 2026"];

export default function TeamList({ isAuthenticated }) {
  // ← добавлен пропс
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    captain: "",
    members: "",
    hackathon: HACKATHONS[0],
  });

  const [filterHackathon, setFilterHackathon] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  // === Загрузка команд с сервера ===
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchTeams({ signal: controller.signal })
      .then((res) => setTeams(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err.message || "Ошибка загрузки");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = `Команды (${teams.length})`;
  }, [teams.length]);

  // === CRUD ===
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Войдите, чтобы добавлять команды");
      return;
    }
    if (!form.name.trim() || !form.captain.trim()) return;

    const tempTeam = {
      id: Date.now(),
      name: form.name.trim(),
      captain: form.captain.trim(),
      members: Number(form.members) || 0,
      hackathon: form.hackathon,
    };

    setTeams((prev) => [...prev, tempTeam]);
    setForm({ name: "", captain: "", members: "", hackathon: HACKATHONS[0] });

    try {
      const res = await createTeam(tempTeam);
      setTeams((prev) =>
        prev.map((t) => (t.id === tempTeam.id ? res.data : t)),
      );
    } catch (err) {
      setTeams((prev) => prev.filter((t) => t.id !== tempTeam.id));
      alert("Ошибка добавления: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      alert("Войдите, чтобы удалять команды");
      return;
    }
    const deleted = teams.find((t) => t.id === id);
    if (!deleted) return;

    setTeams((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTeam(id);
    } catch (err) {
      setTeams((prev) => [...prev, deleted]);
      alert("Ошибка удаления: " + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = (team) => {
    if (!isAuthenticated) {
      alert("Войдите, чтобы редактировать команды");
      return;
    }
    setEditingId(team.id);
    setEditDraft({ ...team });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = async () => {
    if (!editDraft || !editDraft.name.trim()) return;

    const oldTeams = [...teams];
    const updated = {
      ...editDraft,
      name: editDraft.name.trim(),
      captain: editDraft.captain.trim(),
      members: Number(editDraft.members) || 0,
    };

    setTeams((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
    cancelEdit();

    try {
      const res = await updateTeam(editingId, updated);
      setTeams((prev) => prev.map((t) => (t.id === editingId ? res.data : t)));
    } catch (err) {
      setTeams(oldTeams);
      alert("Ошибка сохранения: " + (err.response?.data?.error || err.message));
    }
  };

  // === Фильтр ===
  const visible = useMemo(() => {
    if (filterHackathon === "all") return teams;
    return teams.filter((t) => t.hackathon === filterHackathon);
  }, [teams, filterHackathon]);

  // === Статистика ===
  const stats = useMemo(() => {
    const total = teams.length;
    const totalMembers = teams.reduce(
      (sum, t) => sum + (Number(t.members) || 0),
      0,
    );
    return { total, totalMembers };
  }, [teams]);

  if (loading) return <p className="loading">Загрузка команд…</p>;

  if (error) {
    return (
      <div className="error-state">
        <p>Ошибка: {error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="team-list">
      {/* Форма только для админа */}
      {isAuthenticated ? (
        <form className="item-form" onSubmit={handleAdd}>
          <input
            placeholder="Название команды"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Капитан"
            value={form.captain}
            onChange={(e) => setForm({ ...form, captain: e.target.value })}
          />
          <input
            type="number"
            placeholder="Участников"
            value={form.members}
            onChange={(e) => setForm({ ...form, members: e.target.value })}
          />
          <select
            value={form.hackathon}
            onChange={(e) => setForm({ ...form, hackathon: e.target.value })}
          >
            {HACKATHONS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </form>
      ) : (
        <p className="guest-hint">
          Войдите, чтобы добавлять, изменять и удалять команды.
        </p>
      )}

      <div className="filters">
        <button
          className={filterHackathon === "all" ? "active" : ""}
          onClick={() => setFilterHackathon("all")}
        >
          Все
        </button>
        {HACKATHONS.map((h) => (
          <button
            key={h}
            className={filterHackathon === h ? "active" : ""}
            onClick={() => setFilterHackathon(h)}
          >
            {h}
          </button>
        ))}
      </div>

      <div className="stats">
        <span>
          Всего команд: <b>{stats.total}</b>
        </span>
        <span>
          Всего участников: <b>{stats.totalMembers}</b>
        </span>
      </div>

      <ul className="item-list">
        {visible.length === 0 && (
          <li className="empty-state">Команд по фильтру нет</li>
        )}

        {visible.map((team) =>
          editingId === team.id && editDraft ? (
            <li key={team.id} className="item-card editing">
              <div className="edit-grid">
                <input
                  value={editDraft.name}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, name: e.target.value })
                  }
                />
                <input
                  value={editDraft.captain}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, captain: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editDraft.members}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, members: e.target.value })
                  }
                />
                <select
                  value={editDraft.hackathon}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, hackathon: e.target.value })
                  }
                >
                  {HACKATHONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="actions">
                <button className="btn btn-primary btn-sm" onClick={saveEdit}>
                  Сохранить
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={cancelEdit}
                >
                  Отмена
                </button>
              </div>
            </li>
          ) : (
            <li key={team.id} className="item-card">
              <div className="info">
                <h3 className="title">{team.name}</h3>
                <div className="meta">
                  <span>
                    Капитан: <b>{team.captain}</b>
                  </span>
                  <span>·</span>
                  <span>Участников: {team.members}</span>
                  <span>·</span>
                  <span>{team.hackathon}</span>
                </div>
              </div>
              {/* Кнопки только для админа */}
              {isAuthenticated && (
                <div className="actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => startEdit(team)}
                  >
                    Изменить
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(team.id)}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
