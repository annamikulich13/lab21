export default function Tabs({ active, onChange }) {
  const tabs = [
    { id: "tasks", label: "Задания" },
    { id: "teams", label: "Команды" },
  ];

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? "active" : ""}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
