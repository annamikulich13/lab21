import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initialTeams = [
  {
    id: 1,
    name: "CodeBreakers",
    captain: "Иван Петров",
    members: 4,
    hackathon: "AI Challenge 2026",
  },
  {
    id: 2,
    name: "WebWizards",
    captain: "Мария Смирнова",
    members: 5,
    hackathon: "WebDev Cup",
  },
  {
    id: 3,
    name: "MobileMasters",
    captain: "Алексей Сидоров",
    members: 3,
    hackathon: "Mobile Cup 2026",
  },
];

const HACKATHONS = ["AI Challenge 2026", "WebDev Cup", "Mobile Cup 2026"];

export default function TeamList() {
  const [teams, setTeams] = useLocalStorage("teams", initialTeams);

  const [form, setForm] = useState({
    name: "",
    captain: "",
    members: "",
    hackathon: HACKATHONS[0],
  });

  const [filterHackathon, setFilterHackathon] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  // ============ ДОП. ПОБОЧНЫЙ ЭФФЕКТ: заголовок страницы ============
  useEffect(() => {
    document.title = `Команды (${teams.length})`;
  }, [teams.length]);

  // ============ CRUD ============

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.captain.trim()) return;

    setTeams((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        captain: form.captain.trim(),
        members: Number(form.members) || 0,
        hackathon: form.hackathon,
      },
    ]);

    setForm({ name: "", captain: "", members: "", hackathon: HACKATHONS[0] });
  };

  const handleDelete = (id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (team) => {
    setEditingId(team.id);
    setEditDraft({ ...team });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft || !editDraft.name.trim()) return;

    setTeams((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...editDraft,
              name: editDraft.name.trim(),
              captain: editDraft.captain.trim(),
              members: Number(editDraft.members) || 0,
            }
          : t,
      ),
    );
    cancelEdit();
  };

  // ============ Фильтрация ============

  const visible = useMemo(() => {
    if (filterHackathon === "all") return teams;
    return teams.filter((t) => t.hackathon === filterHackathon);
  }, [teams, filterHackathon]);

  // ============ Статистика ============

  const stats = useMemo(() => {
    const total = teams.length;
    const totalMembers = teams.reduce(
      (sum, t) => sum + (Number(t.members) || 0),
      0,
    );
    return { total, totalMembers };
  }, [teams]);

  // ============ Рендер ============

  return (
    <div className="team-list">
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
                  placeholder="Название команды"
                />
                <input
                  value={editDraft.captain}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, captain: e.target.value })
                  }
                  placeholder="Капитан"
                />
                <input
                  type="number"
                  value={editDraft.members}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, members: e.target.value })
                  }
                  placeholder="Участников"
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
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
