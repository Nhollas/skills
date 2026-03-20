import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  priority: "low" | "medium" | "high";
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.priority === filter);

  const columns = ["todo", "in-progress", "done"] as const;

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="task-board">
      <div className="toolbar">
        <h1>Task Board</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="columns">
        {columns.map((status) => (
          <div key={status} className="column">
            <h2>{status}</h2>
            <div className="task-list">
              {filteredTasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className="assignee">{task.assignee}</span>
                      <span className={`priority priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
