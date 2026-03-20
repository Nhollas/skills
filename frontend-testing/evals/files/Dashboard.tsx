import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

interface Project {
  id: string;
  name: string;
  status: "active" | "archived" | "draft";
  updatedAt: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export function Dashboard() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeNav, setActiveNav] = useState<string>("projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/nav").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/activities").then((r) => r.json()),
    ])
      .then(([nav, proj, act]) => {
        setNavItems(nav);
        setProjects(proj);
        setActivities(act);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.count !== undefined && (
                <span className="nav-count">{item.count}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="projects-section">
          <h2>Projects</h2>
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id} className="project-item">
                <span className="project-name">{project.name}</span>
                <span className={`project-status status-${project.status}`}>
                  {project.status}
                </span>
                <span className="project-updated">{project.updatedAt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="activity-section">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {activities.map((activity) => (
              <li key={activity.id} className="activity-item">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-action">{activity.action}</span>
                <span className="activity-target">{activity.target}</span>
                <span className="activity-time">{activity.timestamp}</span>
              </li>
            ))}
          </ul>
          {activities.length === 0 && <p>No recent activity</p>}
        </div>
      </div>
    </div>
  );
}
