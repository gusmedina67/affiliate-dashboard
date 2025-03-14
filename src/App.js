import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import CustomerAffiliateDashboard from "./pages/customer/CustomerAffiliateDashboard";
import { fetchData } from "./utils/api"; // ✅ Import API utility

function App() {  
  useEffect(() => {
    // ✅ Set Page Title
    document.title = "GSATi Affiliate App";
    
    // ✅ Check if the script is already present
    if (!document.querySelector(`script[src="https://dev-center.platform.commerce7.com/v2/commerce7.js"]`)) {
      const script = document.createElement("script");
      script.src = "https://dev-center.platform.commerce7.com/v2/commerce7.js";
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

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
  const account = searchParams.get("account");
  const adminUITheme = searchParams.get("adminUITheme");

  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFetching = useRef(false); // ✅ Prevent duplicate requests

   // ✅ Apply Theme on Mount or When Theme Changes
   useEffect(() => {
    if (adminUITheme) {
      document.documentElement.setAttribute("data-theme", adminUITheme); // ✅ Set theme attribute
    }
  }, [adminUITheme]);

  useEffect(() => {
    if (isFetching.current) return;

    isFetching.current = true; // ✅ Mark API call as in-progress

    async function authenticateUser() {
      if (!account || !tenantId) {
        setLoading(false);
        return; // ✅ No account token, skip authentication
      }

      try {
        const headers = {
          "Authorization": account,
          "tenant": tenantId,
        };

        const response = await fetchData("commerce7", "account/user", "GET", null, headers);
        setUser(response); // ✅ Store user data on success
      } catch (error) {
        console.error("Authentication failed:", error);
        setAuthError("Unauthorized user. Please contact support.");
      } finally {
        setLoading(false);
      }
    }

    authenticateUser();
  }, [account, tenantId]);

  if (loading) return <p>Loading authentication...</p>;

  if (authError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500">{authError}</h2>
      </div>
    );
  }

  return customerId ? (
    <CustomerAffiliateDashboard customerId={customerId} tenantId={tenantId} />
  ) : (
    <MainDashboard tenantId={tenantId} />
  );
}

export default App;
