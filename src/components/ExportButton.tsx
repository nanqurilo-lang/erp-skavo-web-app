"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

const BASE = `${process.env.NEXT_PUBLIC_MAIN}`;

export default function ExportButton({
  api,
  label = "Export",
  fileName = "export.csv",
}: {
  api: string;
  label?: string;
  fileName?: string;
}) {
  const [loading, setLoading] = useState(false);

  const jsonToCsv = (data: any[]) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);

    const rows = data.map((row) =>
      headers
        .map((field) => {
          const value = row[field] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${BASE}${api}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Export failed");

      const data = await res.json();

      const csv = jsonToCsv(data);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      {loading ? "Exporting..." : label}
    </Button>
  );
}