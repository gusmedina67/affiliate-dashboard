import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import CustomerAffiliateDashboard from "./pages/customer/CustomerAffiliateDashboard";

function App() {
  return (
    <Router>
      <MainComponent />
    </Router>
  );
}

function MainComponent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get("customerId");
  const tenantId = searchParams.get("tenantId");

  return customerId ? (
    <CustomerAffiliateDashboard customerId={customerId} tenantId={tenantId} />
  ) : (
    <MainDashboard tenantId={tenantId} />
  );
}

export default App;


