import { useState, useEffect, useMemo } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api";

const DIFFICULTIES = ["easy", "medium", "hard"];
const PRIORITIES = ["low", "medium", "high"];
const HACKATHONS = ["AI Challenge 2026", "WebDev Cup", "Mobile Cup 2026"];

const toNumber = (v) => {
  if (typeof v === "number") return v;
  const digits = String(v).replace(/[^\d]/g, "");
  return Number(digits) || 0;
};

export default function TaskList({ isAuthenticated }) {
  // ← добавлен пропс
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    points: "",
    hackathon: HACKATHONS[0],
    priority: "medium",
  });

  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  // === Загрузка задач с сервера ===
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchTasks({ signal: controller.signal })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err.message || "Ошибка загрузки");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = `Задания (${tasks.length})`;
  }, [tasks.length]);

  // === CRUD ===
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Войдите, чтобы добавлять задания");
      return;
    }
    if (!form.title.trim()) return;

    const tempTask = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      points: toNumber(form.points),
      hackathon: form.hackathon,
      priority: form.priority,
    };

    setTasks((prev) => [...prev, tempTask]);
    setForm({
      title: "",
      description: "",
      difficulty: "easy",
      points: "",
      hackathon: HACKATHONS[0],
      priority: "medium",
    });

    try {
      const res = await createTask(tempTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? res.data : t)),
      );
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
      alert("Ошибка добавления: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      alert("Войдите, чтобы удалять задания");
      return;
    }
    const deleted = tasks.find((t) => t.id === id);
    if (!deleted) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
    } catch (err) {
      setTasks((prev) => [...prev, deleted]);
      alert("Ошибка удаления: " + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = (task) => {
    if (!isAuthenticated) {
      alert("Войдите, чтобы редактировать задания");
      return;
    }
    setEditingId(task.id);
    setEditDraft({ ...task, points: toNumber(task.points) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = async () => {
    if (!editDraft || !editDraft.title.trim()) return;

    const oldTasks = [...tasks];
    const updated = {
      ...editDraft,
      title: editDraft.title.trim(),
      description: editDraft.description.trim(),
      points: toNumber(editDraft.points),
    };

    setTasks((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
    cancelEdit();

    try {
      const res = await updateTask(editingId, updated);
      setTasks((prev) => prev.map((t) => (t.id === editingId ? res.data : t)));
    } catch (err) {
      setTasks(oldTasks);
      alert("Ошибка сохранения: " + (err.response?.data?.error || err.message));
    }
  };

  // === Фильтр + сортировка ===
  const visible = useMemo(() => {
    let result = [...tasks];

    if (filterDifficulty !== "all") {
      result = result.filter((t) => t.difficulty === filterDifficulty);
    }

    switch (sortBy) {
      case "points-desc":
        result.sort((a, b) => toNumber(b.points) - toNumber(a.points));
        break;
      case "points-asc":
        result.sort((a, b) => toNumber(a.points) - toNumber(b.points));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title, "ru"));
        break;
      default:
        break;
    }

    return result;
  }, [tasks, filterDifficulty, sortBy]);

  // === Статистика ===
  const stats = useMemo(() => {
    const total = tasks.length;
    const totalPoints = tasks.reduce((sum, t) => sum + toNumber(t.points), 0);
    const byDifficulty = DIFFICULTIES.reduce((acc, d) => {
      acc[d] = tasks.filter((t) => t.difficulty === d).length;
      return acc;
    }, {});
    return { total, totalPoints, byDifficulty };
  }, [tasks]);

  if (loading) return <p className="loading">Загрузка заданий…</p>;

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
    <div className="task-list">
      {/* Форма только для админа */}
      {isAuthenticated ? (
        <form className="item-form" onSubmit={handleAdd}>
          <input
            className="full"
            placeholder="Название задания"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="full"
            rows={2}
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Баллы"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: e.target.value })}
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
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </form>
      ) : (
        <p className="guest-hint">
          Войдите, чтобы добавлять, изменять и удалять задания.
        </p>
      )}

      <div className="filters">
        <button
          className={filterDifficulty === "all" ? "active" : ""}
          onClick={() => setFilterDifficulty("all")}
        >
          Все
        </button>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={filterDifficulty === d ? "active" : ""}
            onClick={() => setFilterDifficulty(d)}
          >
            {d}
          </button>
        ))}

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">Без сортировки</option>
          <option value="points-desc">Баллы: убыв.</option>
          <option value="points-asc">Баллы: возр.</option>
          <option value="title">По названию</option>
        </select>
      </div>

      <div className="stats">
        <span>
          Всего заданий: <b>{stats.total}</b>
        </span>
        <span>
          Сумма баллов: <b>{stats.totalPoints}</b>
        </span>
        <span>
          Easy: <b>{stats.byDifficulty.easy}</b> · Medium:{" "}
          <b>{stats.byDifficulty.medium}</b> · Hard:{" "}
          <b>{stats.byDifficulty.hard}</b>
        </span>
      </div>

      <ul className="item-list">
        {visible.length === 0 && (
          <li className="empty-state">Заданий по фильтру нет</li>
        )}

        {visible.map((task) =>
          editingId === task.id && editDraft ? (
            <li key={task.id} className="item-card editing">
              <div className="edit-grid">
                <input
                  className="full"
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, title: e.target.value })
                  }
                />
                <textarea
                  className="full"
                  rows={2}
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, description: e.target.value })
                  }
                />
                <select
                  value={editDraft.difficulty}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, difficulty: e.target.value })
                  }
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editDraft.points}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, points: e.target.value })
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
                <select
                  value={editDraft.priority}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, priority: e.target.value })
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
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
            <li key={task.id} className="item-card">
              <div className="info">
                <h3 className="title">{task.title}</h3>
                {task.description && <p className="desc">{task.description}</p>}
                <div className="meta">
                  <span className={`badge badge-${task.difficulty}`}>
                    {task.difficulty}
                  </span>
                  {task.priority && (
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  )}
                  <span>{task.points} баллов</span>
                  <span>·</span>
                  <span>{task.hackathon}</span>
                </div>
              </div>
              {/* Кнопки только для админа */}
              {isAuthenticated && (
                <div className="actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => startEdit(task)}
                  >
                    Изменить
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
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
