
"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_MAIN!;

type Notification = {
  id: number;
  title: string;
  message: string;
  type?: "TIME_LOG" | "INVOICE" | "PROJECT" | "SYSTEM" | "PROJECT_STATUS_CHANGE" | "LEAVE_APPLICATION" | "CHAT_MESSAGE"
  | "TASK_STATUS_CHANGE" | "ATTENDANCE_DELETION" | "ATTENDANCE";
  readFlag: boolean;
  createdAt: string;
  readAt?: string | null;
};

export default function NotificationBell() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  /* =========================
     Fetch notifications
  ========================== */
  const loadNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/employee/notifications/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      console.log("Notifications loaded:", data);

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load notifications failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Mark as READ
  ========================== */
  const markAsRead = async (id: number) => {
    if (!token) return;

    try {
      await fetch(
        `${API_BASE}/employee/notifications/${id}/mark-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readFlag: true } : n
        )
      );
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  /* =========================
     Mark as UNREAD
  ========================== */
  const markAsUnread = async (id: number) => {
    if (!token) return;

    try {
      await fetch(
        `${API_BASE}/employee/notifications/${id}/mark-unread`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readFlag: false } : n
        )
      );
    } catch (err) {
      console.error("Mark unread failed", err);
    }
  };

  /* =========================
     Mark ALL as READ
  ========================== */
  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await fetch(
        `${API_BASE}/employee/notifications/mark-all-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readFlag: true }))
      );
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  /* =========================
     Notification redirect
  ========================== */
  const redirectByType = (n: Notification) => {
    switch (n.type) {
      case "TIME_LOG":
        router.push("/work/timesheet");
        break;
      case "INVOICE":
        router.push("/finance/invoices");
        break;
      case "PROJECT_STATUS_CHANGE":
        router.push("/work/project");
        break;
      case "LEAVE_APPLICATION":
        router.push("/hr/leaves");
        break;
      case "CHAT_MESSAGE":
        router.push("/messages");
        break;
      case "TASK_STATUS_CHANGE":
        router.push("/work/tasks");
        break;
      case "ATTENDANCE_DELETION":
        router.push("/hr/attendance");
        break;
      case "ATTENDANCE":
        router.push("/hr/attendance");
        break;
      default:

    }
  };

  /* =========================
     Toggle dropdown
  ========================== */
  const toggle = () => {
    setOpen((prev) => !prev);
    if (!open) loadNotifications();
  };

  /* =========================
     Outside click close
  ========================== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================
     Auto refresh (polling)
  ========================== */
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30 * 1000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.readFlag
  ).length;

  return (
    <div className="relative" ref={ref}>
      {/* 🔔 Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="relative"
      >
        <Bell className="h-4 w-4 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>

      {/* 🔽 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 rounded-md border bg-white shadow-lg z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold">
              Notifications
            </span>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-4 text-sm text-gray-500">
                Loading...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                No notifications 🎉
              </div>
            )}

            {!loading &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.readFlag) markAsRead(n.id);
                    redirectByType(n);
                  }}
                  className={`px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${!n.readFlag ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {n.title}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(
                          n.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>

                    {n.readFlag && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsUnread(n.id);
                        }}
                        className="text-[10px] text-blue-600 hover:underline whitespace-nowrap"
                      >
                        Mark unread
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}







