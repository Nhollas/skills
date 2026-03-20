import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list">
      <h2>Team Members</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-card">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>No team members found.</p>}
    </div>
  );
}
