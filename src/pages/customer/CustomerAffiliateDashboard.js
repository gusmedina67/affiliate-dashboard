import { useState } from "react";
import CustomerDashboard from "../../components/dashboard/customer/CustomerDashboard";
import ReferralStatus from "../../components/dashboard/customer/ReferralStatus";
import CustomerOrders from "../../components/dashboard/customer/CustomerOrders";
import CustomerCommissions from "../../components/dashboard/customer/CustomerCommissions";
import "../../App.css"; // ✅ Ensure styles are applied

export default function CustomerAffiliateDashboard({ customerId, tenantId }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container customer-dashboard"> {/* ✅ Added container class */}
      {/* <h1 className="text-2xl font-bold mb-4">Affiliate Details for Customer</h1> */}

      {/* Tabs Navigation */}
      <nav className="tabs">
        <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Dashboard</button>
        <button onClick={() => setActiveTab("referralStatus")} className={activeTab === "referralStatus" ? "active" : ""}>Referral Status</button>
        <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>Orders</button>
        <button onClick={() => setActiveTab("commissions")} className={activeTab === "commissions" ? "active" : ""}>Commissions</button>
      </nav>

      {/* Tab Content */}
      <div className="content">
        {activeTab === "dashboard" && <CustomerDashboard customerId={customerId} tenantId={tenantId} />}
        {activeTab === "referralStatus" && <ReferralStatus customerId={customerId} tenantId={tenantId} />}
        {activeTab === "orders" && <CustomerOrders customerId={customerId} tenantId={tenantId} />}
        {activeTab === "commissions" && <CustomerCommissions customerId={customerId} tenantId={tenantId} />}
      </div>
    </div>
  );
}
