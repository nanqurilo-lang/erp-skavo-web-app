// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";

// const BASE_URL = process.env.NEXT_PUBLIC_MAIN!;

// export default function AddFollowupModal({
//   open,
//   deal,
//   onClose,
//   onSaved,
// }: {
//   open: boolean;
//   deal: any;
//   onClose: () => void;
//   onSaved: () => void;
// }) {
//   const [nextDate, setNextDate] = useState<Date | undefined>();
//   const [startTime, setStartTime] = useState("");
//   const [sendReminder, setSendReminder] = useState(true);
//   const [remindValue, setRemindValue] = useState("");
//   const [remindUnit, setRemindUnit] = useState("minutes");
//   const [remark, setRemark] = useState("");
//   const [saving, setSaving] = useState(false);

//   if (!open || !deal) return null;

//   const saveFollowup = async () => {
//     if (!nextDate || !startTime) return alert("Date & time required");

//     setSaving(true);

//     const token = localStorage.getItem("accessToken");

//     await fetch(`${BASE_URL}/deals/${deal.id}/followups`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         nextDate: format(nextDate, "yyyy-MM-dd"),
//         startTime,
//         sendReminder,
//         remindBefore: sendReminder
//           ? `${remindValue} ${remindUnit}`
//           : null,
//         remarks: remark,
//       }),
//     });

//     setSaving(false);
//     onSaved();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/30" onClick={onClose} />

//       <div className="relative w-full max-w-2xl bg-white rounded-xl p-6">
//         <h3 className="text-lg font-semibold mb-6">
//           Add Follow Up – {deal.leadName}
//         </h3>

//         <div className="grid grid-cols-2 gap-4">
//           {/* Date */}
//           <div>
//             <label className="text-sm">Next Follow Up *</label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-full justify-between">
//                   {nextDate ? format(nextDate, "dd-MM-yyyy") : "Select date"}
//                   <CalendarIcon className="h-4 w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="p-0">
//                 <Calendar
//                   mode="single"
//                   selected={nextDate}
//                   onSelect={setNextDate}
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* Time */}
//           <div>
//             <label className="text-sm">Start Time *</label>
//             <Input
//               type="time"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Reminder */}
//         <div className="flex items-center gap-2 mt-4">
//           <Checkbox
//             checked={sendReminder}
//             onCheckedChange={(v) => setSendReminder(!!v)}
//           />
//           <span className="text-sm">Send Reminder</span>
//         </div>

//         {sendReminder && (
//           <div className="grid grid-cols-2 gap-4 mt-3">
//             <Input
//               placeholder="Remind before"
//               value={remindValue}
//               onChange={(e) => setRemindValue(e.target.value)}
//             />
//             <select
//               className="border rounded-md px-2"
//               value={remindUnit}
//               onChange={(e) => setRemindUnit(e.target.value)}
//             >
//               <option value="minutes">Minutes</option>
//               <option value="hours">Hours</option>
//               <option value="days">Days</option>
//             </select>
//           </div>
//         )}

//         {/* Remark */}
//         <div className="mt-4">
//           <label className="text-sm">Remark</label>
//           <textarea
//             className="w-full border rounded-md p-2 mt-1"
//             rows={3}
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 mt-6">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={saveFollowup} disabled={saving}>
//             Save
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const BASE_URL = process.env.NEXT_PUBLIC_MAIN;

export default function AddFollowupModal({
  open,
  deal,
  onClose,
  onSaved,
}: {
  open: boolean;
  deal: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nextDate, setNextDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [sendReminder, setSendReminder] = useState(true);
  const [remindBefore, setRemindBefore] = useState<number>(1);
  const [remindUnit, setRemindUnit] = useState<"MINUTES" | "HOURS" | "DAYS">(
    "DAYS"
  );
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open || !deal) return null;

  const saveFollowup = async () => {
    if (!nextDate || !startTime) {
      alert("Next follow up date & time required");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication token missing");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${BASE_URL}/deals/${deal.id}/followups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nextDate: format(nextDate, "yyyy-MM-dd"),
          startTime,
          remarks,
          sendReminder,
          remindBefore: sendReminder ? remindBefore : null,
          remindUnit: sendReminder ? remindUnit : null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create followup");
      }

      await res.json(); // response not required but safe

      onSaved();   // refresh deals
      onClose();   // close modal
    } catch (err) {
      console.error("Add followup error:", err);
      alert("Failed to add follow up");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">
          Add Follow Up – {deal.leadName || "Deal"}
        </h3>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Next Follow Up *</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {nextDate ? format(nextDate, "dd-MM-yyyy") : "Select date"}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={nextDate}
                  onSelect={setNextDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm">Start Time *</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        {/* Reminder */}
        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            checked={sendReminder}
            onCheckedChange={(v) => setSendReminder(Boolean(v))}
          />
          <span className="text-sm">Send Reminder</span>
        </div>

        {sendReminder && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              type="number"
              min={1}
              placeholder="Remind before"
              value={remindBefore}
              onChange={(e) => setRemindBefore(Number(e.target.value))}
            />

            <select
              className="border rounded-md px-2 py-1"
              value={remindUnit}
              onChange={(e) =>
                setRemindUnit(e.target.value as any)
              }
            >
              <option value="MINUTES">Minutes</option>
              <option value="HOURS">Hours</option>
              <option value="DAYS">Days</option>
            </select>
          </div>
        )}

        {/* Remarks */}
        <div className="mt-4">
          <label className="text-sm">Remarks</label>
          <textarea
            className="w-full border rounded-md p-2 mt-1"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveFollowup} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
