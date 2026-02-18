"use client";

import { useState } from "react";

type Followup = {
  id?: number;
  nextDate: string;
  startTime: string;
  remarks?: string;
  sendReminder?: boolean;
  remindBefore?: number;
  remindUnit?: "DAYS" | "HOURS" | "MINUTES" | string;
  status?: "PENDING" | "CANCELLED" | "COMPLETED" | string;
};

const BASE_URL = `${process.env.NEXT_PUBLIC_MAIN}`;

export default function EditFollowupModal({
  dealId,
  followup,
  onClose,
  onUpdated,
}: {
  dealId: string;
  followup: Followup;
  onClose: () => void;
  onUpdated: (updated: Followup) => void;
}) {
  const [form, setForm] = useState<Followup>({
    ...followup,
    status: (followup.status || "PENDING").toUpperCase(),
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.nextDate || !form.startTime) {
      alert("Next Date and Start Time are required");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/deals/${dealId}/followups/${form.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            status: form.status?.toUpperCase(),
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to update followup");
      }

      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update followup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl border p-6 mx-4">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Follow Up</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label>Next Date *</label>
            <input
              type="date"
              value={form.nextDate}
              onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
              className="mt-2 w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label>Start Time *</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="mt-2 w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="mt-2 w-full border rounded-md px-3 py-2"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label>Remind Before</label>
            <input
              type="number"
              value={form.remindBefore}
              onChange={(e) =>
                setForm({ ...form, remindBefore: Number(e.target.value) })
              }
              className="mt-2 w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label>Remarks</label>
            <textarea
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              className="mt-2 w-full border rounded-md px-3 py-2 min-h-[100px]"
            />
          </div>

        </div>

        <div className="flex justify-center gap-6 mt-6">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
