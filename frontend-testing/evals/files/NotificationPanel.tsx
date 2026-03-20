import { useEffect, useRef, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "warning" | "error";
  timestamp: string;
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function TypeIcon({ type }: { type: Notification["type"] }) {
  const icons = { info: "ℹ", warning: "⚠", error: "✕" };
  return <span className={`type-icon type-${type}`}>{icons[type]}</span>;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      const atBottom =
        Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 10;
      setIsAtBottom(atBottom);
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [notifications, isAtBottom]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <div className="title-group">
          <BellIcon />
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="mark-all-read">
            <CheckIcon />
            Mark all read
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="notification-list"
        data-testid="notification-scroll"
        data-at-bottom={isAtBottom}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? "read" : "unread"}`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <TypeIcon type={notification.type} />
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">
                {notification.message}
              </div>
              <div className="notification-time">{notification.timestamp}</div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="empty">No notifications</p>
        )}
      </div>
    </div>
  );
}
