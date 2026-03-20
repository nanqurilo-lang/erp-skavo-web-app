
"use client"

import useSWR, { mutate } from "swr"

import { useState, useMemo, useEffect } from "react"
import MarkAttendanceModal from "./MarkAttendanceModal"
import AttendanceDetailModal from "./AttendanceDetailModal"
import { Button } from "@/components/ui/button"
import { List, User } from "lucide-react"

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const BASE_URL = process.env.NEXT_PUBLIC_MAIN

// ---------------- TYPES ----------------
interface Attendance {
    date: string
    employeeId: string
    employeeName: string
    profilePictureUrl?: string
    status: "PRESENT" | "ABSENT" | "HOLIDAY" | "LEAVE"
    late: boolean
    halfDay: boolean
}

const ATTENDANCE_KEY = `${BASE_URL}/employee/attendance/GetAllAttendance`


// ---------------- FETCHER ----------------
const fetcher = async (url: string) => {
    const token = localStorage.getItem("accessToken")
    if (!token) throw new Error("No token")
    //console.log("urlllll", url)

    const res = await fetch(`${BASE_URL}/employee/attendance/GetAllAttendance`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error("Failed to fetch attendance")
    return res.json()
}

// ---------------- STATUS ICONS ----------------
const STATUS_ICON: Record<string, JSX.Element> = {
    PRESENT: <span className="text-green-600">✔</span>,
    HOLIDAY: <span className="text-yellow-500">★</span>,
    LEAVE: <span className="text-red-500">⛔</span>,
    ABSENT: <span className="text-gray-400">—</span>,
}

// ================= COMPONENT =================
export default function AttendanceCalendar() {
    const today = new Date()

    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear())
    const [open, setOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState<Attendance | null>(null)
    const [openDetail, setOpenDetail] = useState(false)

    // ---------------- API ----------------
    const { data, isLoading } = useSWR<Attendance[]>(
        ATTENDANCE_KEY,
        fetcher,
        { revalidateOnFocus: false }
    )

    useEffect(() => {
        fetcher
    }, [open])

    // ---------------- GROUP BY EMPLOYEE ----------------
    const groupedAttendance = useMemo(() => {
        const map: Record<
            string,
            {
                employeeName: string
                profilePictureUrl?: string
                records: Record<string, Attendance>
            }
        > = {}

        data?.forEach((a) => {
            if (!map[a.employeeId]) {
                map[a.employeeId] = {
                    employeeName: a.employeeName,
                    profilePictureUrl: a.profilePictureUrl,
                    records: {},
                }
            }
            map[a.employeeId].records[a.date] = a
        })

        return map
    }, [data])

    const daysInMonth = new Date(year, month, 0).getDate()

    // if (isLoading) {
    //     return <div className="text-sm text-gray-500">Loading attendance…</div>
    // }

    return (
        <div className="bg-white border rounded-lg p-4 space-y-4">
            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between">


 {isLoading ? (
    <>
      <Skeleton width={140} height={35} />
      <div className="flex gap-2">
        <Skeleton width={120} height={35} />
        <Skeleton width={100} height={35} />
      </div>
    </>
  ) : (
    <>

                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                >
                    + Mark Attendance
                </button>

                <div className="flex items-center gap-2 text-sm">
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="border rounded px-4 py-2"
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i + 1}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border rounded px-4 py-2"
                    >
                        {[2025, 2026, 2027, 2028].map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>

</>
  )}
            </div>



            {/* ================= LEGEND ================= */}
           {isLoading ? (
  <Skeleton width={300} height={15} />
) : (
           
            <div className="flex gap-4 text-xs text-gray-600">
                <span>★ Holiday</span>
                <span>✔ Present</span>
                <span>⛔ Leave</span>
                <span>⏰ Late</span>
                <span>½ Half Day</span>
            </div>
)}
            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Employee</th>
                            {Array.from({ length: daysInMonth }).map((_, i) => (
                                <th key={i} className="px-2 py-2 text-center">
                                    {i + 1}
                                </th>
                            ))}
                            <th className="px-3 py-2">Total</th>
                        </tr>
                    </thead>

                  <tbody>
  {isLoading
    ? Array.from({ length: 5 }).map((_, row) => (
        <tr key={row} className="border-t">
          {/* Employee column */}
          <td className="px-3 py-2 flex items-center gap-2">
            <Skeleton circle width={24} height={24} />
            <div>
              <Skeleton width={100} />
              <Skeleton width={60} />
            </div>
          </td>

          {/* Days columns */}
          {Array.from({ length: daysInMonth }).map((_, col) => (
            <td key={col} className="px-2 py-2 text-center">
              <Skeleton width={10} height={10} />
            </td>
          ))}

          {/* Total */}
          <td className="px-3 py-2">
            <Skeleton width={40} />
          </td>
        </tr>
      ))
    : Object.entries(groupedAttendance).map(([empId, emp]) => (
        // 🔥 your existing row (NO CHANGE)
                         
                         <tr key={empId} className="border-t">
                                {/* EMPLOYEE */}
                                <td className="px-3 py-2 font-medium flex items-center gap-2">
                                    {emp.profilePictureUrl && (
                                        <img
                                            src={emp.profilePictureUrl}
                                            className="w-6 h-6 rounded-full"
                                            alt=""
                                        />
                                    )}
                                    <div>
                                        <div>{emp.employeeName}</div>
                                        <div className="text-[10px] text-gray-500">{empId}</div>
                                    </div>
                                </td>

                                {/* DAYS */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = String(i + 1).padStart(2, "0")
                                    const dateKey = `${year}-${String(month).padStart(2, "0")}-${day}`
                                    const att = emp.records[dateKey]

                                    return (
                                        <td key={i} className="px-2 py-2 text-center">
                                            {att ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedDay(att)
                                                        setOpenDetail(true)
                                                    }}
                                                    className="flex flex-col items-center text-xs hover:scale-110 transition"
                                                >
                                                    {STATUS_ICON[att.status]}
                                                    {att.late && <span>⏰</span>}
                                                    {att.halfDay && <span>½</span>}
                                                </button>
                                            ) : (
                                                "--"
                                            )}
                                        </td>
                                    )
                                })}

                                {/* TOTAL */}
                                <td className="px-3 py-2 text-center font-semibold">
                                    {
                                        Object.values(emp.records).filter(
                                            (a) =>
                                                a.status === "PRESENT" &&
                                                a.date.startsWith(
                                                    `${year}-${String(month).padStart(2, "0")}`
                                                )
                                        ).length
                                    }
                                    /{daysInMonth}
                                </td>
                            </tr>
                        ))}
                    </tbody>






                </table>
            </div>

            {/* ================= MODALS ================= */}
            <MarkAttendanceModal
                open={open}
                onClose={() => {
                    setOpen(false)
                    mutate(ATTENDANCE_KEY) // 🔥 refresh table
                }}
            />


            <AttendanceDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                data={selectedDay}
            />
        </div>
    )
}
