import { useState } from "react";
import TaskList from "./components/TaskList";
import TeamList from "./components/TeamList";
import Tabs from "./components/Tabs";
import "./App.css";

function App() {
  const [tab, setTab] = useState("tasks");

  return (
    <div className="App">
      <h1>Хакатон-платформа</h1>
      <p className="subtitle">
        Управление заданиями и командами — данные хранятся в localStorage
      </p>

      <Tabs active={tab} onChange={setTab} />

      {tab === "tasks" && <TaskList />}
      {tab === "teams" && <TeamList />}
    </div>
  );
}

export default App;
