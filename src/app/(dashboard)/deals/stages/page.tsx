"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import type { Stage } from "@/types/stages";
import type { Deal } from "@/types/deals";
import AddStagePanel from "./_components/add-stages-panel";
import KanbanBoard from "./_components/kanban-board";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar, CalendarIcon, LayoutGrid, SlidersHorizontal, TableIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
// import { Select } from "react-day-picker";
// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CalendarIcon,
  LayoutGrid,
  TableIcon,
  SlidersHorizontal,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { FiltersDrawer } from "../get/page";


// import { format } from "date-fns";

export default function StagesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
const [openFilters, setOpenFilters] = useState(false);



// const resolvedFilters = useMemo(
//   () => ({
//     pipeline: pipelineFilter === "all" ? null : pipelineFilter,
//     category: categoryFilter,
//   }),
//   [pipelineFilter, categoryFilter],
// );


const resolvedFilters = useMemo(
  () => ({
    pipeline: pipelineFilter === "all" ? null : pipelineFilter,
    category: categoryFilter,
  }),
  [pipelineFilter, categoryFilter],
);



// 🔥 PASTE HERE

  // Fetch token once on mount
  useEffect(() => {
    const t =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    setToken(t);
  }, []);

  const fetchWithAuth = async (url: string) => {
    if (!token) throw new Error("No access token found. Please log in.");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  };

  const {
    data: stagesData = [],
    isLoading: stagesLoading,
    error: stagesError,
    mutate: mutateStages,
  } = useSWR<Stage[]>(token ? "/api/deals/stages" : null, fetchWithAuth);

  const {
    data: dealsData = [],
    isLoading: dealsLoading,
    error: dealsError,
    mutate: mutateDeals,
  } = useSWR<Deal[]>(token ? "/api/deals/get" : null, fetchWithAuth);



const filteredDeals = useMemo(() => {
  return dealsData.filter((deal) => {
    const matchesPipeline =
      !pipelineFilter ||
      pipelineFilter === "all" ||
      deal.pipeline === pipelineFilter;

    const matchesSearch =
      !search ||
      deal.title?.toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;

    if (dateFrom || dateTo) {
      const dealDate = deal.createdAt
        ? new Date(deal.createdAt)
        : null;

      if (dealDate) {
        if (dateFrom && dealDate < dateFrom) matchesDate = false;
        if (dateTo && dealDate > dateTo) matchesDate = false;
      }
    }

    return matchesPipeline && matchesSearch && matchesDate;
  });
}, [dealsData, pipelineFilter, search, dateFrom, dateTo]);





  // Combine loading and error states
  const loading = stagesLoading || dealsLoading;
  const error = stagesError?.message || dealsError?.message || null;

  // Compute stageDeals using memoization
  const stageDeals = useMemo(() => {
    return stagesData.map((stage) => ({
      ...stage,
      deals: dealsData.filter((deal) => deal.dealStage === stage.name),
    }));
  }, [stagesData, dealsData]);


// ✅ ADD HERE
const pipelines = useMemo(() => {
  const unique = new Set<string>();
  dealsData.forEach((deal) => {
    if (deal.pipeline) unique.add(deal.pipeline);
  });
  return Array.from(unique);
}, [dealsData]);


  // Compute filters using memoization
  // const resolvedFilters = useMemo(
  //   () => ({
  //     pipeline: pipelineFilter,
  //     category: categoryFilter,
  //   }),
  //   [pipelineFilter, categoryFilter],
  // );




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading stages and deals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <main className="container h-screen flex flex-col overflow-hidden">



 <div className="mb-4 rounded-md border bg-white py-2 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="text-xs text-muted-foreground">Duration</div>
           
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-sm"
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




{/* 
{openFilters && (
  <FiltersDrawer
    open={openFilters}
    onClose={() => setOpenFilters(false)}
  />
)} */}


{openFilters && (
  // <FiltersDrawer
  //   open={openFilters}
  //   onClose={() => setOpenFilters(false)}
  //   stages={stagesData.map((s) => s.name)}  // 👈 pass stages
  //   deals={dealsData}                       // 👈 pass deals
  //   priorities={[]}                         // 👈 temporary empty (since not loaded here)
  // />

<FiltersDrawer
  open={openFilters}
  onClose={() => setOpenFilters(false)}

  stages={stagesData.map((s) => s.name)}   // ✅ correct
deals={filteredDeals} 
 priorities={[]}                          // ✅ since not fetched here

  dateFilterOn="created"
  setDateFilterOn={() => {}}
  dateFrom={dateFrom}
  setDateFrom={setDateFrom}
  dateTo={dateTo}
  setDateTo={setDateTo}
  dealStageFilter="all"
  setDealStageFilter={() => {}}
  minValue=""
  setMinValue={() => {}}
  maxValue=""
  setMaxValue={() => {}}
  agentFilter="all"
  setAgentFilter={() => {}}
  watcherFilter="all"
  setWatcherFilter={() => {}}
  leadFilter="all"
  setLeadFilter={() => {}}
  tagFilter="all"
  setTagFilter={() => {}}
  priorityFilter="all"
  setPriorityFilter={() => {}}
/>



)}







      <div className="flex flex-col min-h-screen  overflow-x-hidden">




 




        
        {/* //   <div className="flex flex-col flex-1 overflow-hidden"> */}
        <div className="flex flex-col flex-1 p-4 w-full">
          <header className="shrink-0 mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* <h1 className="text-3xl font-bold text-foreground text-balance">Deals – Kanban </h1> */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* <footer className="mt-6">
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Back to Home
                </Link>
              </footer> */}
              <AddStagePanel
                onCreated={async () => {
                  await mutateStages();
                }}
                getToken={() => token}
              />
              <Button asChild className="rounded-md bg-blue-600 px-3 py-3 text-sm text-white hover:opacity-95">
                <Link href="/deals/create">+ Add Deals</Link>
              </Button>
            </div>
            {/* View Toggle */}
            <div className="mb-4 flex justify-end">
              <Tabs className="w-auto" defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table" asChild>
                    <Link href="/deals/get" className="flex items-center gap-2">
                      <TableIcon className="h-4 w-4" />
                    </Link>
                  </TabsTrigger>

                  <TabsTrigger value="kanban" asChild>
                    <Link
                      href="/deals/stages"
                      className="flex items-center gap-2"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-auto">
            <KanbanBoard
              stages={stagesData}
deals={filteredDeals}
              search={search}
              filters={resolvedFilters}
            />
          </main>
        </div>





        
      </div>
    </main>
  );
}
