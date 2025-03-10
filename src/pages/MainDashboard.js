import React, { useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import Affiliates from "../components/dashboard/Affiliates";
import Reports from "../components/dashboard/Reports";
import Commissions from "../components/dashboard/Commissions";
import Payouts from "../components/dashboard/Payouts";
import "../App.css";

export default function MainDashboard({ tenantId }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Affiliate Management for {tenantId}</h1>

      {/* Tabs Navigation */}
      <nav className="tabs">
        <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Dashboard</button>
        <button onClick={() => setActiveTab("affiliates")} className={activeTab === "affiliates" ? "active" : ""}>Affiliates</button>
        <button onClick={() => setActiveTab("reports")} className={activeTab === "reports" ? "active" : ""}>Reports</button>
        <button onClick={() => setActiveTab("commissions")} className={activeTab === "commissions" ? "active" : ""}>Commissions</button>
        <button onClick={() => setActiveTab("payouts")} className={activeTab === "payouts" ? "active" : ""}>Payouts</button>
      </nav>

      {/* Tab Content */}
      <div className="content">
        {activeTab === "dashboard" && <Dashboard tenantId={tenantId} />}
        {activeTab === "affiliates" && <Affiliates tenantId={tenantId} />}
        {activeTab === "reports" && <Reports tenantId={tenantId} />}
        {activeTab === "commissions" && <Commissions tenantId={tenantId} />}
        {activeTab === "payouts" && <Payouts tenantId={tenantId} />}
      </div>
    </div>
  );
}
