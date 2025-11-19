"use client";

import StatsCard from "./components/StatsCard";
import VisitorsChart from "./components/VisitorsChart";
import DocumentsTable from "./components/DocumentsTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* STATISTIC CARDS */}
      <StatsCard />

      {/* CHART */}
      <VisitorsChart />

      {/* TABLE WITH TABS */}
      <DocumentsTable />
    </div>
  );
}
