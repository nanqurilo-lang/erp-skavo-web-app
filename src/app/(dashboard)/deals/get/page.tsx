// "use client";

// import { useEffect, useMemo, useState } from "react";
// import useSWR from "swr";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   LayoutGrid,
//   TableIcon,
//   MoreVertical,
//   SlidersHorizontal,
//   Search,
// } from "lucide-react";

// type Followup = {
//   id: number;
//   nextDate?: string;
//   startTime?: string;
//   remarks?: string;
//   sendReminder?: boolean;
//   reminderSent?: boolean;
//   createdAt?: string;
// };

// type PriorityObject = {
//   id: number;
//   status: string;
//   color?: string;
//   dealId?: number | null;
//   isGlobal?: boolean;
// };

// type Deal = {
//   id: number | string;
//   title?: string;
//   value?: number;
//   dealStage?: string;
//   dealCategory?: string;
//   pipeline?: string;
//   dealAgent?: string;
//   dealAgentMeta?: {
//     employeeId?: string;
//     name?: string;
//     designation?: string | null;
//     department?: string | null;
//     profileUrl?: string | null;
//   };
//   createdAt?: string;
//   leadId?: number;
//   leadName?: string;
//   leadMobile?: string;
//   leadEmail?: string;
//   expectedCloseDate?: string;
//   followups?: Followup[];
//   tags?: string[];
//   dealWatchers?: string[]; // array of employee ids
//   dealWatchersMeta?: {
//     employeeId?: string;
//     name?: string;
//     profileUrl?: string | null;
//   }[];
//   assignedEmployeesMeta?: {
//     employeeId?: string;
//     name?: string;
//     profileUrl?: string | null;
//   }[];
//   priority?: string | number | PriorityObject | null;
// };

// type PriorityItem = {
//   id: number;
//   status: string;
//   color?: string;
//   dealId?: number | null;
//   isGlobal?: boolean;
// };

// const BASE_URL = `${process.env.NEXT_PUBLIC_MAIN}`;

// // Use uploaded images as fallback avatars (local paths provided earlier)
// const sampleDesktopImage = "/mnt/data/Screenshot 2025-11-21 122016.png";
// const sampleMobileImage = "/mnt/data/Screenshot 2025-11-21 122307.png";

// export default function DealsPage() {
//   const [token, setToken] = useState<string | null>(null);
//   const [query, setQuery] = useState("");
//   const [stageFilter, setStageFilter] = useState<string>("all");

//   // UI-only state for the top nav (keeps functionality same; not used to filter results unless you wire it)
//   const [pipelineFilter, setPipelineFilter] = useState<string>("all");
//   const [dateRange, setDateRange] = useState<string>(""); // placeholder string for "Start Date to End Date"

//   useEffect(() => {
//     const t =
//       typeof window !== "undefined"
//         ? localStorage.getItem("accessToken")
//         : null;
//     setToken(t);
//   }, []);

//   const authFetcher = async (url: string) => {
//     if (!token) throw new Error("No access token found. Please log in.");
//     const res = await fetch(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) {
//       const txt = await res.text().catch(() => "");
//       throw new Error(`Failed to fetch ${url}: ${res.status} ${txt}`);
//     }
//     return res.json();
//   };

//   // Fetch deals (kept same endpoint as you used)
//   const {
//     data: deals = [],
//     error: dealsError,
//     isLoading: dealsLoading,
//     mutate: mutateDeals,
//   } = useSWR(token ? "/api/deals/get" : null, authFetcher);

//   // Fetch global priorities list
//   const { data: priorities = [] as PriorityItem[] } = useSWR(
//     token ? `${BASE_URL}/deals/admin/priorities` : null,
//     authFetcher,
//   );

//   const priorityByStatus = useMemo(() => {
//     const m = new Map<string, PriorityItem>();
//     for (const p of priorities || []) {
//       if (p.status) m.set(String(p.status).toLowerCase(), p);
//     }
//     return m;
//   }, [priorities]);

//   const priorityById = useMemo(() => {
//     const m = new Map<number, PriorityItem>();
//     for (const p of priorities || []) {
//       m.set(p.id, p);
//     }
//     return m;
//   }, [priorities]);

//   const stages = useMemo(() => {
//     const s = new Set<string>();
//     for (const d of deals as Deal[]) {
//       if (d.dealStage) s.add(d.dealStage);
//     }
//     return Array.from(s.values()).sort();
//   }, [deals]);

//   // derive pipeline values for the top nav dropdown (UI only)
//   const pipelines = useMemo(() => {
//     const s = new Set<string>();
//     for (const d of deals as Deal[]) {
//       if (d.pipeline) s.add(d.pipeline);
//     }
//     return Array.from(s.values()).sort();
//   }, [deals]);

//   const getNextFollowupDate = (followups?: Followup[]) => {
//     if (!followups || followups.length === 0) return null;
//     const valid = followups.filter((f) => f && f.nextDate).slice();
//     if (valid.length === 0) return null;
//     valid.sort(
//       (a, b) =>
//         new Date(a.nextDate as string).getTime() -
//         new Date(b.nextDate as string).getTime(),
//     );
//     return valid[0].nextDate || null;
//   };

//   const filteredDeals = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return (deals as Deal[]).filter((d) => {
//       const matchesStage =
//         stageFilter === "all" ||
//         String(d.dealStage || "").toLowerCase() === stageFilter.toLowerCase();
//       const hay = [
//         d.title,
//         d.dealAgentMeta?.name,
//         d.dealAgent,
//         d.dealCategory,
//         d.pipeline,
//         String(d.id),
//         d.leadName,
//         d.leadEmail,
//         d.leadMobile,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();
//       const matchesQuery = q.length === 0 || hay.includes(q);
//       return matchesStage && matchesQuery;
//     });
//   }, [deals, query, stageFilter]);

//   if (dealsLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold">
//         Loading deals...
//       </div>
//     );
//   }

//   if (dealsError) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold text-destructive">
//         {(dealsError as Error).message ||
//           "Failed to load deals. Please try again later."}
//       </div>
//     );
//   }

//   // Normalize priority input to status string
//   const normalizePriorityString = (p?: unknown) => {
//     if (p === null || p === undefined) return "low";
//     if (typeof p === "string") return p.toLowerCase();
//     if (typeof p === "number") {
//       const byId = priorityById.get(p);
//       if (byId?.status) return String(byId.status).toLowerCase();
//       return "low";
//     }
//     try {
//       const o = p as PriorityObject;
//       if (o && o.status) return String(o.status).toLowerCase();
//       return String(p).toLowerCase();
//     } catch {
//       return "low";
//     }
//   };

//   const getPriorityColor = (p?: unknown) => {
//     if (
//       p &&
//       typeof p === "object" &&
//       "color" in (p as any) &&
//       (p as any).color
//     ) {
//       return (p as any).color as string;
//     }
//     if (typeof p === "number") {
//       const item = priorityById.get(p);
//       if (item?.color) return item.color;
//     }
//     const s = normalizePriorityString(p);
//     const item = priorityByStatus.get(s);
//     if (item?.color) return item.color;
//     switch (s) {
//       case "high":
//         return "#ef4444";
//       case "medium":
//         return "#f59e0b";
//       default:
//         return "#10b981";
//     }
//   };

//   // POST assign priority: per your latest API: POST ${baseUrl}/deals/{{dealId}}/priority/assign with body { priorityId: <number> }
//   const handlePriorityAssign = async (
//     dealId: number | string,
//     newPriorityIdOrVal: string | number,
//   ) => {
//     if (!token) return;
//     try {
//       // prefer numeric id
//       const asNum = Number(newPriorityIdOrVal);
//       let priorityIdToSend: number | null = !Number.isNaN(asNum) ? asNum : null;

//       if (priorityIdToSend === null) {
//         // resolve status -> id
//         const found = priorityByStatus.get(
//           String(newPriorityIdOrVal).toLowerCase(),
//         );
//         if (found) priorityIdToSend = found.id;
//       }

//       if (priorityIdToSend === null) {
//         console.error("Could not resolve priorityId for:", newPriorityIdOrVal);
//         return;
//       }

//       const url = `${BASE_URL}/deals/${dealId}/priority/assign`;
//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ priorityId: priorityIdToSend }),
//       });

//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         console.error("Failed to assign priority:", res.status, txt);
//         return;
//       }

//       await mutateDeals();
//     } catch (err) {
//       console.error("Error assigning priority:", err);
//     }
//   };

//   // PUT stage: per your API: PUT ${baseUrl}/deals/:dealId/stage?stage=Win
//   const handleStageChange = async (
//     dealId: number | string,
//     newStage: string,
//   ) => {
//     if (!token) return;
//     try {
//       const url = `${BASE_URL}/deals/${dealId}/stage?stage=${encodeURIComponent(
//         newStage,
//       )}`;
//       const res = await fetch(url, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         console.error("Failed to update stage:", res.status, txt);
//         return;
//       }
//       await mutateDeals();
//     } catch (err) {
//       console.error("Error updating stage:", err);
//     }
//   };

//   // DELETE deal
//   const handleDeleteDeal = async (dealId: number | string) => {
//     // if (!token) return;

//     // const confirmed = window.confirm(
//     //   "Are you sure you want to delete this deal? This action cannot be undone.",
//     // );
//     // if (!confirmed) return;

//     try {
//       console.log("delete devesh", dealId);
//       const res = await fetch(`${BASE_URL}/deals/${dealId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         console.error("Failed to delete deal:", res.status, txt);
//         alert("Failed to delete deal. Please try again.");
//         return;
//       }

//       // Refresh list
//       await mutateDeals();
//     } catch (err) {
//       console.error("Error deleting deal:", err);
//       alert("Something went wrong while deleting the deal.");
//     }
//   };

//   return (
//     <main className="container mx-auto max-w-6xl px-4 py-8">
//       <div className="p-0 ">
//         {/* Top mini nav (matches provided image) */}
//         <div className="mb-4 rounded-md border bg-white py-2 px-4 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 text-sm">
//             <div className="text-xs text-muted-foreground">Duration</div>
//             {/* simple text input representing start to end (UI only) */}
//             <Input
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               placeholder="Start Date to End Date"
//               className="w-[300px] text-sm"
//             />
//             <div className="text-xs text-muted-foreground">Pipeline</div>
//             <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
//               <SelectTrigger className="w-36 text-sm py-1">
//                 <SelectValue placeholder="All pipelines" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {pipelines.length ? (
//                   pipelines.map((p) => (
//                     <SelectItem key={p} value={p}>
//                       {p}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <>
//                     <SelectItem value="Sales">Sales</SelectItem>
//                     <SelectItem value="Marketing">Marketing</SelectItem>
//                     <SelectItem value="Partnerships">Partnerships</SelectItem>
//                   </>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm" className="px-2">
//               <div className="flex items-center gap-2">
//                 <SlidersHorizontal className="h-4 w-4" />
//                 <span className="text-sm">Filters</span>
//               </div>
//             </Button>
//           </div>
//         </div>

//         {/* Header row: Add Deal left, search + view toggles right (matches image layout) */}
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-4">
//             <Button asChild>
//               <Link href="/deals/create">+ Add Deal</Link>
//             </Button>
//           </div>

//           <div className="flex w-full items-center gap-3 md:max-w-2xl md:justify-end">
//             {/* smaller search on right similar to image */}
//             <div className="flex items-center gap-2 w-full md:w-auto">
//               <div className="relative">
//                 <Input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search deals"
//                   aria-label="Search deals"
//                   className="pr-10"
//                 />
//                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
//                   <Search className="h-4 w-4 text-muted-foreground" />
//                 </div>
//               </div>

//               {/* view toggles */}
//               <Tabs className="w-auto" defaultValue="table">
//                 <TabsList>
//                   <TabsTrigger value="table" asChild>
//                     <Link
//                       href="/deals/get"
//                       className="flex items-center gap-2 px-2"
//                     >
//                       <TableIcon className="h-4 w-4" />
//                     </Link>
//                   </TabsTrigger>
//                   <TabsTrigger value="kanban" asChild>
//                     <Link
//                       href="/deals/stages"
//                       className="flex items-center gap-2 px-2"
//                     >
//                       <LayoutGrid className="h-4 w-4" />
//                     </Link>
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//           </div>
//         </div>

//         {/* main table */}
//         <div className="overflow-x-auto rounded-xl border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="min-w-[200px]">Deal Name</TableHead>
//                 <TableHead>Lead Name</TableHead>
//                 <TableHead>Contact Details</TableHead>
//                 <TableHead>Value</TableHead>
//                 <TableHead>Close Date</TableHead>
//                 <TableHead>Next Follow Up</TableHead>
//                 <TableHead>Deal Agent</TableHead>
//                 <TableHead>Deal Watcher</TableHead>
//                 <TableHead>Stage</TableHead>
//                 <TableHead>Priority Status</TableHead>
//                 <TableHead>Tags</TableHead>
//                 <TableHead className="text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredDeals.map((deal: Deal) => {
//                 const nextFollowUp = getNextFollowupDate(deal.followups);
//                 const nextFollowUpDisplay = nextFollowUp
//                   ? new Date(nextFollowUp).toLocaleDateString()
//                   : "—";

//                 const watchersNames =
//                   deal.dealWatchersMeta && deal.dealWatchersMeta.length > 0
//                     ? deal.dealWatchersMeta
//                         .map((w) => w.name)
//                         .filter(Boolean)
//                         .join(", ")
//                     : (deal.dealWatchers || []).join(", ") || "—";

//                 let prioritySelectValue: string;
//                 if (
//                   deal.priority === null ||
//                   typeof deal.priority === "undefined"
//                 ) {
//                   const fallback =
//                     priorities?.find(
//                       (p) => String(p.status).toLowerCase() === "low",
//                     ) || priorities?.[0];
//                   prioritySelectValue = fallback ? String(fallback.id) : "Low";
//                 } else if (
//                   typeof deal.priority === "object" &&
//                   "id" in (deal.priority as any)
//                 ) {
//                   prioritySelectValue = String(
//                     (deal.priority as PriorityObject).id,
//                   );
//                 } else if (typeof deal.priority === "number") {
//                   prioritySelectValue = String(deal.priority);
//                 } else {
//                   const found = priorityByStatus.get(
//                     String(deal.priority).toLowerCase(),
//                   );
//                   prioritySelectValue = found
//                     ? String(found.id)
//                     : String(deal.priority);
//                 }

//                 const priorityColor = getPriorityColor(deal.priority);

//                 return (
//                   <TableRow key={String(deal.id)} className="align-top">
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
//                           <img
//                             src={
//                               (deal.dealAgentMeta?.profileUrl as string) ||
//                               sampleDesktopImage
//                             }
//                             alt={
//                               deal.dealAgentMeta?.name ||
//                               deal.dealAgent ||
//                               "agent"
//                             }
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="min-w-0">
//                           <Link
//                             href={`/deals/get/${deal.id}`}
//                             className="line-clamp-1 font-medium hover:underline"
//                           >
//                             {deal.title || "—"}
//                           </Link>
//                           <div className="text-xs text-muted-foreground">
//                             ID: {deal.id}
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>{deal.leadName || "—"}</TableCell>

//                     <TableCell className="text-sm text-muted-foreground">
//                       <div>{deal.leadEmail || "—"}</div>
//                       <div>{deal.leadMobile || "—"}</div>
//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">
//                       {typeof deal.value === "number"
//                         ? `$${deal.value.toLocaleString()}`
//                         : "—"}
//                     </TableCell>

//                     <TableCell>
//                       {deal.expectedCloseDate
//                         ? new Date(deal.expectedCloseDate).toLocaleDateString()
//                         : "—"}
//                     </TableCell>

//                     <TableCell>{nextFollowUpDisplay}</TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
//                           <img
//                             src={
//                               (deal.dealAgentMeta?.profileUrl as string) ||
//                               sampleMobileImage
//                             }
//                             alt={
//                               deal.dealAgentMeta?.name ||
//                               deal.dealAgent ||
//                               "agent"
//                             }
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="min-w-0">
//                           <div className="text-sm">
//                             {deal.dealAgentMeta?.name || deal.dealAgent || "—"}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Team Lead
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-sm">{watchersNames}</TableCell>

//                     {/* Stage select - now persists via PUT */}
//                     <TableCell>
//                       <Select
//                         value={deal.dealStage || "Qualified"}
//                         onValueChange={(val) => {
//                           handleStageChange(deal.id, val);
//                         }}
//                       >
//                         <SelectTrigger className="w-36" aria-label="Deal stage">
//                           <SelectValue
//                             placeholder={deal.dealStage || "Stage"}
//                           />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {stages.length ? (
//                             stages.map((s) => (
//                               <SelectItem key={s} value={s}>
//                                 {s}
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <>
//                               <SelectItem value="Qualified">
//                                 Qualified
//                               </SelectItem>
//                               <SelectItem value="Win">Win</SelectItem>
//                               <SelectItem value="Lost">Lost</SelectItem>
//                             </>
//                           )}
//                         </SelectContent>
//                       </Select>
//                     </TableCell>

//                     {/* Priority select - now uses POST /priority/assign with body { priorityId } */}
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <span
//                           className="inline-block w-3 h-3 rounded-full"
//                           style={{ backgroundColor: priorityColor }}
//                         />
//                         <div className="flex-1">
//                           <Select
//                             value={prioritySelectValue}
//                             onValueChange={(val) => {
//                               const asNum = Number(val);
//                               const toSend = !Number.isNaN(asNum)
//                                 ? asNum
//                                 : (() => {
//                                     const resolved = priorityByStatus.get(
//                                       String(val).toLowerCase(),
//                                     );
//                                     return resolved ? resolved.id : null;
//                                   })();
//                               if (toSend !== null)
//                                 handlePriorityAssign(deal.id, toSend);
//                             }}
//                           >
//                             <SelectTrigger
//                               className="w-32 text-sm py-1"
//                               aria-label="Priority status"
//                             >
//                               <SelectValue placeholder="Priority" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {(priorities && priorities.length > 0
//                                 ? priorities
//                                 : [
//                                     { id: 3, status: "Low", color: "#10b981" },
//                                     {
//                                       id: 4,
//                                       status: "Medium",
//                                       color: "#f59e0b",
//                                     },
//                                     { id: 1, status: "High", color: "#ef4444" },
//                                   ]
//                               ).map((p: PriorityItem) => (
//                                 <SelectItem key={p.id} value={String(p.id)}>
//                                   <div className="flex items-center gap-2">
//                                     <span
//                                       className="inline-block w-2 h-2 rounded-full"
//                                       style={{ backgroundColor: p.color }}
//                                     />
//                                     <span>{p.status}</span>
//                                   </div>
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-sm text-muted-foreground">
//                       {(deal.tags &&
//                         deal.tags.length > 0 &&
//                         deal.tags.join(", ")) ||
//                         "—"}
//                     </TableCell>

//                     <TableCell className="text-right">
//                       <div className="flex justify-end">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="p-2">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem asChild>
//                               <Link href={`/deals/get/${deal.id}`}>View</Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem asChild>
//                               <Link href={`/deals/create/${deal.id}`}>
//                                 Edit
//                               </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="text-destructive focus:text-destructive"
//                               onClick={() => handleDeleteDeal(deal.id)}
//                             >
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}

//               {filteredDeals.length === 0 && (
//                 <TableRow>
//                   <TableCell
//                     colSpan={12}
//                     className="py-10 text-center text-sm text-muted-foreground"
//                   >
//                     No deals found. Adjust your filters or search terms.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="mt-4">
//           <Link href="/dashboard" className="underline">
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }





"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import AddFollowupModal from "../_components/AddFollowupModal";





import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  TableIcon,
  MoreVertical,
  SlidersHorizontal,
  Search,
} from "lucide-react";

type Followup = {
  id: number;
  nextDate?: string;
  startTime?: string;
  remarks?: string;
  sendReminder?: boolean;
  reminderSent?: boolean;
  createdAt?: string;
};

type PriorityObject = {
  id: number;
  status: string;
  color?: string;
  dealId?: number | null;
  isGlobal?: boolean;
};

type Deal = {
  id: number | string;
  title?: string;
  value?: number;
  dealStage?: string;
  dealCategory?: string;
  pipeline?: string;
  dealAgent?: string;
  dealAgentMeta?: {
    employeeId?: string;
    name?: string;
    designation?: string | null;
    department?: string | null;
    profileUrl?: string | null;
  };
  createdAt?: string;
  leadId?: number;
  leadName?: string;
  leadMobile?: string;
  leadEmail?: string;
  expectedCloseDate?: string;
  followups?: Followup[];
  tags?: string[];
  dealWatchers?: string[]; // array of employee ids
  dealWatchersMeta?: {
    employeeId?: string;
    name?: string;
    profileUrl?: string | null;
  }[];
  assignedEmployeesMeta?: {
    employeeId?: string;
    name?: string;
    profileUrl?: string | null;
  }[];
  priority?: string | number | PriorityObject | null;
};

type PriorityItem = {
  id: number;
  status: string;
  color?: string;
  dealId?: number | null;
  isGlobal?: boolean;
};

const BASE_URL = `${process.env.NEXT_PUBLIC_MAIN}`;

// Use uploaded images as fallback avatars (local paths provided earlier)
const sampleDesktopImage = "/mnt/data/Screenshot 2025-11-21 122016.png";
const sampleMobileImage = "/mnt/data/Screenshot 2025-11-21 122307.png";

export default function DealsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // UI-only state for the top nav (keeps functionality same; not used to filter results unless you wire it)
  const [pipelineFilter, setPipelineFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>(""); // placeholder string for "Start Date to End Date"

  // 🔥 NEW: duration (date range)
  // const [dateFrom, setDateFrom] = useState<Date | undefined>();
  // const [dateTo, setDateTo] = useState<Date | undefined>();

  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const [openFilters, setOpenFilters] = useState(false);

  // filter form state
  const [dateFilterOn, setDateFilterOn] = useState<"created" | "close">("created");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [watcherFilter, setWatcherFilter] = useState("all");
  const [leadFilter, setLeadFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [openFollowup, setOpenFollowup] = useState(false);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);






  useEffect(() => {
    const t =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    setToken(t);
  }, []);

  const authFetcher = async (url: string) => {
    if (!token) throw new Error("No access token found. Please log in.");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Failed to fetch ${url}: ${res.status} ${txt}`);
    }
    return res.json();
  };

  // Fetch deals (kept same endpoint as you used)
  const {
    data: deals = [],
    error: dealsError,
    isLoading: dealsLoading,
    mutate: mutateDeals,
  } = useSWR(token ? "/api/deals/get" : null, authFetcher);

  // Fetch global priorities list
  const { data: priorities = [] as PriorityItem[] } = useSWR(
    token ? `${BASE_URL}/deals/admin/priorities` : null,
    authFetcher,
  );

  const priorityByStatus = useMemo(() => {
    const m = new Map<string, PriorityItem>();
    for (const p of priorities || []) {
      if (p.status) m.set(String(p.status).toLowerCase(), p);
    }
    return m;
  }, [priorities]);

  const priorityById = useMemo(() => {
    const m = new Map<number, PriorityItem>();
    for (const p of priorities || []) {
      m.set(p.id, p);
    }
    return m;
  }, [priorities]);

  const stages = useMemo(() => {
    const s = new Set<string>();
    for (const d of deals as Deal[]) {
      if (d.dealStage) s.add(d.dealStage);
    }
    return Array.from(s.values()).sort();
  }, [deals]);

  // derive pipeline values for the top nav dropdown (UI only)
  const pipelines = useMemo(() => {
    const s = new Set<string>();
    for (const d of deals as Deal[]) {
      if (d.pipeline) s.add(d.pipeline);
    }
    return Array.from(s.values()).sort();
  }, [deals]);

  // const getNextFollowupDate = (followups?: Followup[]) => {
  //   if (!followups || followups.length === 0) return null;
  //   const valid = followups.filter((f) => f && f.nextDate).slice();
  //   if (valid.length === 0) return null;
  //   valid.sort(
  //     (a, b) =>
  //       new Date(a.nextDate as string).getTime() -
  //       new Date(b.nextDate as string).getTime(),
  //   );
  //   return valid[0].nextDate || null;
  // };



  const getNextFollowup = (followups?: Followup[]) => {
    if (!followups?.length) return null;

    return [...followups]
      .filter((f) => f?.nextDate)
      .sort(
        (a, b) =>
          new Date(a.nextDate!).getTime() -
          new Date(b.nextDate!).getTime()
      )[0];
  };



  // const filteredDeals = useMemo(() => {
  //   const q = query.trim().toLowerCase();

  //   return (deals as Deal[]).filter((d) => {
  //     const matchesStage =
  //       stageFilter === "all" ||
  //       String(d.dealStage || "").toLowerCase() === stageFilter.toLowerCase();

  //     const hay = [
  //       d.title,
  //       d.dealAgentMeta?.name,
  //       d.dealAgent,
  //       d.dealCategory,
  //       d.pipeline,
  //       String(d.id),
  //       d.leadName,
  //       d.leadEmail,
  //       d.leadMobile,
  //     ]
  //       .filter(Boolean)
  //       .join(" ")
  //       .toLowerCase();

  //     const matchesQuery = q.length === 0 || hay.includes(q);

  //     // 🗓️ DATE RANGE FILTER (SAFE VERSION)
  //     const matchesDate =
  //       (!dateFrom || (d.createdAt && new Date(d.createdAt) >= dateFrom)) &&
  //       (!dateTo || (d.createdAt && new Date(d.createdAt) <= dateTo));




  //     // value filter
  //     const dealValue = Number(d.value || 0);
  //     if (minValue && dealValue < Number(minValue)) return false;
  //     if (maxValue && dealValue > Number(maxValue)) return false;

  //     // agent filter
  //     if (
  //       agentFilter !== "all" &&
  //       d.dealAgentMeta?.name !== agentFilter
  //     ) {
  //       return false;
  //     }

  //     // priority filter
  //     if (
  //       priorityFilter !== "all" &&
  //       String(d.priority).toLowerCase() !== priorityFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }




  //     return matchesStage && matchesQuery && matchesDate;
  //   });
  // }, [deals, query, stageFilter, dateFrom, dateTo]);



  const normalizePriorityString = (p?: unknown) => {
    if (p === null || p === undefined) return "low";
    if (typeof p === "string") return p.toLowerCase();
    if (typeof p === "number") {
      const byId = priorityById.get(p);
      if (byId?.status) return String(byId.status).toLowerCase();
      return "low";
    }
    try {
      const o = p as PriorityObject;
      if (o && o.status) return String(o.status).toLowerCase();
      return String(p).toLowerCase();
    } catch {
      return "low";
    }
  };





  const filteredDeals = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (deals as Deal[]).filter((d) => {
      /* ---------------- STAGE ---------------- */
      const matchesStage =
        stageFilter === "all" ||
        String(d.dealStage || "").toLowerCase() === stageFilter.toLowerCase();

      /* ---------------- SEARCH ---------------- */
      const hay = [
        d.title,
        d.dealAgentMeta?.name,
        d.dealAgent,
        d.dealCategory,
        d.pipeline,
        String(d.id),
        d.leadName,
        d.leadEmail,
        d.leadMobile,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = q.length === 0 || hay.includes(q);



      /* ---------------- PIPELINE FILTER ---------------- */
      const matchesPipeline =
        pipelineFilter === "all" ||
        String(d.pipeline || "").toLowerCase() ===
        pipelineFilter.toLowerCase();


      /* ---------------- DATE FILTER ---------------- */
      let dateToCheck: Date | null = null;

      if (dateFilterOn === "created" && d.createdAt) {
        dateToCheck = new Date(d.createdAt);
      }

      if (dateFilterOn === "close" && d.expectedCloseDate) {
        dateToCheck = new Date(d.expectedCloseDate);
      }

      const matchesDate =
        (!dateFrom || (dateToCheck && dateToCheck >= dateFrom)) &&
        (!dateTo || (dateToCheck && dateToCheck <= dateTo));

      /* ---------------- VALUE FILTER ---------------- */
      const dealValue = Number(d.value || 0);
      if (minValue && dealValue < Number(minValue)) return false;
      if (maxValue && dealValue > Number(maxValue)) return false;

      /* ---------------- AGENT FILTER ---------------- */
      if (
        agentFilter !== "all" &&
        d.dealAgentMeta?.name !== agentFilter
      ) {
        return false;
      }

      /* ---------------- PRIORITY FILTER ---------------- */
      if (priorityFilter !== "all") {
        const dealPriority = normalizePriorityString(d.priority);
        if (dealPriority !== priorityFilter.toLowerCase()) return false;
      }

      /* ---------------- WATCHER FILTER ---------------- */
      if (watcherFilter !== "all") {
        const watcherIds =
          d.dealWatchersMeta?.map((w) => w.employeeId) || [];
        if (!watcherIds.includes(watcherFilter)) return false;
      }

      /* ---------------- LEAD FILTER ---------------- */
      if (leadFilter !== "all" && String(d.leadId) !== leadFilter) {
        return false;
      }

      /* ---------------- TAG FILTER ---------------- */
      if (
        tagFilter !== "all" &&
        !(d.tags || []).includes(tagFilter)
      ) {
        return false;
      }

      return (
        matchesStage &&
        matchesQuery &&
        matchesDate &&
        matchesPipeline

      );
    });
  }, [
    deals,
    query,
    stageFilter,
    pipelineFilter, // 👈 add this

    dateFrom,
    dateTo,
    dateFilterOn,
    minValue,
    maxValue,
    agentFilter,
    watcherFilter,
    leadFilter,
    tagFilter,
    priorityFilter,
  ]);





  if (dealsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold">
        Loading deals...
      </div>
    );
  }

  if (dealsError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold text-destructive">
        {(dealsError as Error).message ||
          "Failed to load deals. Please try again later."}
      </div>
    );
  }

  // Normalize priority input to status string
  // const normalizePriorityString = (p?: unknown) => {
  //   if (p === null || p === undefined) return "low";
  //   if (typeof p === "string") return p.toLowerCase();
  //   if (typeof p === "number") {
  //     const byId = priorityById.get(p);
  //     if (byId?.status) return String(byId.status).toLowerCase();
  //     return "low";
  //   }
  //   try {
  //     const o = p as PriorityObject;
  //     if (o && o.status) return String(o.status).toLowerCase();
  //     return String(p).toLowerCase();
  //   } catch {
  //     return "low";
  //   }
  // };



  const getPriorityColor = (p?: unknown) => {
    if (
      p &&
      typeof p === "object" &&
      "color" in (p as any) &&
      (p as any).color
    ) {
      return (p as any).color as string;
    }
    if (typeof p === "number") {
      const item = priorityById.get(p);
      if (item?.color) return item.color;
    }
    const s = normalizePriorityString(p);
    const item = priorityByStatus.get(s);
    if (item?.color) return item.color;
    switch (s) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  // POST assign priority: per your latest API: POST ${baseUrl}/deals/{{dealId}}/priority/assign with body { priorityId: <number> }
  // const handlePriorityAssign = async (
  //   dealId: number | string,
  //   newPriorityIdOrVal: string | number,
  // ) => {
  //   if (!token) return;
  //   try {
  //     // prefer numeric id
  //     const asNum = Number(newPriorityIdOrVal);
  //     let priorityIdToSend: number | null = !Number.isNaN(asNum) ? asNum : null;

  //     if (priorityIdToSend === null) {
  //       // resolve status -> id
  //       const found = priorityByStatus.get(
  //         String(newPriorityIdOrVal).toLowerCase(),
  //       );
  //       if (found) priorityIdToSend = found.id;
  //     }

  //     if (priorityIdToSend === null) {
  //       console.error("Could not resolve priorityId for:", newPriorityIdOrVal);
  //       return;
  //     }

  //     const url = `${BASE_URL}/deals/${dealId}/priority/assign`;
  //     const res = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ priorityId: priorityIdToSend }),
  //     });

  //     if (!res.ok) {
  //       const txt = await res.text().catch(() => "");
  //       console.error("Failed to assign priority:", res.status, txt);
  //       return;
  //     }

  //     await mutateDeals();
  //   } catch (err) {
  //     console.error("Error assigning priority:", err);
  //   }
  // };







  const handlePriorityAssign = async (
    dealId: number | string,
    priorityId: number
  ) => {
    if (!token) return;

    try {
      // 🔥 Optimistic update
      mutateDeals(
        (currentDeals: Deal[] = []) =>
          currentDeals.map((d) =>
            String(d.id) === String(dealId)
              ? { ...d, priority: priorityId }
              : d
          ),
        false
      );

      const res = await fetch(
        `${BASE_URL}/deals/${dealId}/priority`,
        {
          method: "PUT", // 👈 change this
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priorityId: priorityId,
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        console.error("Priority API error:", res.status, txt);
        await mutateDeals(); // revert
        return;
      }

      await mutateDeals(); // refresh from backend
    } catch (err) {
      console.error("Priority update error:", err);
      await mutateDeals();
    }
  };



  // PUT stage: per your API: PUT ${baseUrl}/deals/:dealId/stage?stage=Win
  const handleStageChange = async (
    dealId: number | string,
    newStage: string,
  ) => {
    if (!token) return;
    try {
      const url = `${BASE_URL}/deals/${dealId}/stage?stage=${encodeURIComponent(
        newStage,
      )}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Failed to update stage:", res.status, txt);
        return;
      }
      await mutateDeals();
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  // DELETE deal
  const handleDeleteDeal = async (dealId: number | string) => {
    // if (!token) return;

    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this deal? This action cannot be undone.",
    // );
    // if (!confirmed) return;

    try {
      console.log("delete devesh", dealId);
      const res = await fetch(`${BASE_URL}/deals/${dealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Failed to delete deal:", res.status, txt);
        alert("Failed to delete deal. Please try again.");
        return;
      }

      // Refresh list
      await mutateDeals();
    } catch (err) {
      console.error("Error deleting deal:", err);
      alert("Something went wrong while deleting the deal.");
    }
  };

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="p-0 ">
        {/* Top mini nav (matches provided image) */}
        <div className="mb-4 rounded-md border bg-white py-2 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="text-xs text-muted-foreground">Duration</div>
            {/* simple text input representing start to end (UI only) */}
            {/* <Input
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Start Date to End Date"
              className="w-[300px] text-sm"
            /> */}



            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[260px] justify-start text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Start Date to End Date
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[320px] p-4" align="start">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Select Duration</div>

                  {/* START DATE */}
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Start Date</div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                        >
                          {dateFrom
                            ? format(dateFrom, "dd-MM-yyyy")
                            : "dd-mm-yyyy"}
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={(date) => {
                            setDateFrom(date);
                            // auto-fix: end date chhoti ho to clear
                            if (dateTo && date && dateTo < date) {
                              setDateTo(undefined);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* END DATE */}
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">End Date</div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                          disabled={!dateFrom}
                        >
                          {dateTo
                            ? format(dateTo, "dd-MM-yyyy")
                            : "dd-mm-yyyy"}
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          fromDate={dateFrom}
                          onSelect={(date) => setDateTo(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* RESET */}
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateFrom(undefined);
                        setDateTo(undefined);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>





            <div className="text-xs text-muted-foreground">Pipeline </div>
            <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
              <SelectTrigger className="w-36 text-sm py-1">
                <SelectValue placeholder="All pipelines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {pipelines.length ? (
                  pipelines.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Partnerships">Partnerships</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="sm" className="px-2"> */}


            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => setOpenFilters(true)}
            >


              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filters </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Header row: Add Deal left, search + view toggles right (matches image layout) */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild >
              <Link href="/deals/create">+ Add Deal</Link>
            </Button>
          </div>

          <div className="flex w-full items-center gap-3 md:max-w-2xl md:justify-end">
            {/* smaller search on right similar to image */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search deals"
                  aria-label="Search deals"
                  className="pr-10"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* view toggles */}
              <Tabs className="w-auto" defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table" asChild>
                    <Link
                      href="/deals/get"
                      className="flex items-center gap-2 px-2"
                    >
                      <TableIcon className="h-4 w-4" />
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="kanban" asChild>
                    <Link
                      href="/deals/stages"
                      className="flex items-center gap-2 px-2"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* main table */}
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Deal Name</TableHead>
                <TableHead>Lead Name</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Next Follow Up</TableHead>
                <TableHead>Deal Agent</TableHead>
                <TableHead>Deal Watcher</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Priority Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDeals.map((deal: Deal) => {
                // const nextFollowUp = getNextFollowupDate(deal.followups);

                const nextFollowup = getNextFollowup(deal.followups);
                // const nextFollowUpDisplay = nextFollowUp
                //   ? new Date(nextFollowUp).toLocaleDateString()
                //   : "—";

                const watchersNames =
                  deal.dealWatchersMeta && deal.dealWatchersMeta.length > 0
                    ? deal.dealWatchersMeta
                      .map((w) => w.name)
                      .filter(Boolean)
                      .join(", ")
                    : (deal.dealWatchers || []).join(", ") || "—";

                let prioritySelectValue: string;
                if (
                  deal.priority === null ||
                  typeof deal.priority === "undefined"
                ) {
                  const fallback =
                    priorities?.find(
                      (p) => String(p.status).toLowerCase() === "low",
                    ) || priorities?.[0];
                  prioritySelectValue = fallback ? String(fallback.id) : "Low";
                } else if (
                  typeof deal.priority === "object" &&
                  "id" in (deal.priority as any)
                ) {
                  prioritySelectValue = String(
                    (deal.priority as PriorityObject).id,
                  );
                } else if (typeof deal.priority === "number") {
                  prioritySelectValue = String(deal.priority);
                } else {
                  const found = priorityByStatus.get(
                    String(deal.priority).toLowerCase(),
                  );
                  prioritySelectValue = found
                    ? String(found.id)
                    : String(deal.priority);
                }



const selectedPriority = priorities.find(
  (p) => String(p.id) === prioritySelectValue
);





                const priorityColor = getPriorityColor(deal.priority);

                return (
                  <TableRow key={String(deal.id)} className="align-top">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={
                              (deal.dealAgentMeta?.profileUrl as string) ||
                              sampleDesktopImage
                            }
                            alt={
                              deal.dealAgentMeta?.name ||
                              deal.dealAgent ||
                              "agent"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/deals/get/${deal.id}`}
                            className="line-clamp-1 font-medium hover:underline"
                          >
                            {deal.title || "—"}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            ID: {deal.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{deal.leadName || "—"}</TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      <div>{deal.leadEmail || "—"}</div>
                      <div>{deal.leadMobile || "—"}</div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {typeof deal.value === "number"
                        ? `$${deal.value.toLocaleString()}`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {/* {deal.expectedCloseDate
                        ? new Date(deal.expectedCloseDate).toLocaleDateString()
                        : "—"} */}

{deal.expectedCloseDate
    ? format(new Date(deal.expectedCloseDate), "dd-MM-yyyy")
    : "—"}

                    </TableCell>

                    {/* <TableCell>{nextFollowUpDisplay}</TableCell> */}

                    <TableCell>
                      {nextFollowup ? (
                        <button
                          onClick={() => {
                            setActiveFollowup(nextFollowup);
                            setActiveDeal(deal);
                            setOpenFollowupView(true);
                          }}
                          className=" text-sm hover:text-blue-800"
                        >
                          {/* {new Date(nextFollowup.nextDate!).toLocaleDateString()} */}
                          {format(new Date(nextFollowup.nextDate!), "dd-MM-yyyy")}

                        </button>
                      ) : (
                        "—"
                      )}
                    </TableCell>





                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={
                              (deal.dealAgentMeta?.profileUrl as string) ||
                              sampleMobileImage
                            }
                            alt={
                              deal.dealAgentMeta?.name ||
                              deal.dealAgent ||
                              "agent"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm">
                            {deal.dealAgentMeta?.name || deal.dealAgent || "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Team Lead
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">{watchersNames}</TableCell>

                    {/* Stage select - now persists via PUT */}
                    <TableCell>
                      <Select
                        value={deal.dealStage || "Qualified"}
                        onValueChange={(val) => {
                          handleStageChange(deal.id, val);
                        }}
                      >
                        <SelectTrigger className="w-36" aria-label="Deal stage">
                          <SelectValue
                            placeholder={deal.dealStage || "Stage"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.length ? (
                            stages.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="Qualified">
                                Qualified
                              </SelectItem>
                              <SelectItem value="Win">Win</SelectItem>
                              <SelectItem value="Lost">Lost</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Priority select - now uses POST /priority/assign with body { priorityId } */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: priorityColor }}
                        />
                        <div className="flex-1">
                          <Select
                            value={prioritySelectValue}
                            onValueChange={(val) => {
                              const asNum = Number(val);
                              const toSend = !Number.isNaN(asNum)
                                ? asNum
                                : (() => {
                                  const resolved = priorityByStatus.get(
                                    String(val).toLowerCase(),
                                  );
                                  return resolved ? resolved.id : null;
                                })();
                              if (toSend !== null)
                                handlePriorityAssign(deal.id, toSend);
                            }}
                          >
                            {/* <SelectTrigger
                              className="w-32 text-sm py-1"
                              aria-label="Priority status"
                            >
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger> */}

<SelectTrigger
  className="w-32 text-sm py-1"
  aria-label="Priority status"
>
  {selectedPriority ? (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: selectedPriority.color }}
      />
      <span className="text-sm">
        {selectedPriority.status}
      </span>
    </div>
  ) : (
    <span className="text-sm text-muted-foreground">
      Priority
    </span>
  )}
</SelectTrigger>



                            <SelectContent>
                              {(priorities && priorities.length > 0
                                ? priorities
                                : [
                                  { id: 3, status: "Low", color: "#10b981" },
                                  {
                                    id: 4,
                                    status: "Medium",
                                    color: "#f59e0b",
                                  },
                                  { id: 1, status: "High", color: "#ef4444" },
                                ]
                              ).map((p: PriorityItem) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="inline-block w-2 h-2 rounded-full"
                                      style={{ backgroundColor: p.color }}
                                    />
                                    <span>{p.status}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {(deal.tags &&
                        deal.tags.length > 0 &&
                        deal.tags.join(", ")) ||
                        "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/deals/get/${deal.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/deals/create/${deal.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>


                            <DropdownMenuItem
                              onClick={() => {
                                setActiveDeal(deal);
                                setOpenFollowup(true);
                              }}
                            >
                              Add Follow Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteDeal(deal.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredDeals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No deals found. Adjust your filters or search terms.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Link href="/dashboard" className="underline">
            Back to Home
          </Link>
        </div>
      </div>




      {openFilters && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpenFilters(false)}
          />

          {/* drawer */}
          <div className="relative ml-auto h-full w-[320px] bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpenFilters(false)}>
                ✕
              </Button>
            </div>

            {/* Date Filter On */}
            <div className="space-y-1 mb-4">
              <div className="text-sm">Date Filter On </div>
              <Select value={dateFilterOn} onValueChange={(v) => setDateFilterOn(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="close">Expected Close</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deal Value */}
            <div className="space-y-1 mb-4">
              <div className="text-sm">Deals Value</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>

            {/* Agent */}
            <div className="space-y-1 mb-4">
              <div className="text-sm">Agent</div>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {(deals as Deal[])
                    .map((d) => d.dealAgentMeta?.name)
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((name) => (
                      <SelectItem key={name} value={name!}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1 mb-6">
              <div className="text-sm">Priority Status</div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {/* {priorities.map((p) => ( */}


                  {/* {priorities
                    .filter((p) =>
                      ["high", "medium", "low"].includes(
                        String(p.status).toLowerCase()
                      )
                    )
                    .map((p) => (

                      <SelectItem key={p.id} value={String(p.id)}>

                        {p.status}
                      </SelectItem>
                    ))} */}


{priorities
  .filter((p) =>
    ["high", "medium", "low"].includes(
      String(p.status).toLowerCase()
    )
  )
  .map((p) => (
    <SelectItem
      key={p.id}
      value={String(p.status).toLowerCase()}
    >
      {p.status}
    </SelectItem>
  ))}




                </SelectContent>
              </Select>
            </div>

            {/* CLEAR */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setDateFilterOn("created");
                setMinValue("");
                setMaxValue("");
                setAgentFilter("all");
                setWatcherFilter("all");
                setLeadFilter("all");
                setTagFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear
            </Button>

          </div>

        </div>
      )}




      <AddFollowupModal
        open={openFollowup}
        deal={activeDeal}
        onClose={() => {
          setOpenFollowup(false);
          setActiveDeal(null);
        }}
        onSaved={() => mutateDeals()}
      />







    </main>
  );
}
