import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Автоматически подставляем JWT-токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === Задания (Tasks) ===
export const fetchTasks = (config = {}) => api.get("/tasks", config);
export const createTask = (task) => api.post("/tasks", task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// === Команды (Teams) ===
export const fetchTeams = (config = {}) => api.get("/teams", config);
export const createTeam = (team) => api.post("/teams", team);
export const updateTeam = (id, team) => api.put(`/teams/${id}`, team);
export const deleteTeam = (id) => api.delete(`/teams/${id}`);
// === Аутентификация ===
export const register = (data) => api.post("/auth/register", data);
