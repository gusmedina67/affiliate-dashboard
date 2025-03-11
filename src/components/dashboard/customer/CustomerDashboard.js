import { useState, useEffect, createContext, useContext, useRef } from "react";
import { Card, CardContent } from "../../ui/card";
import { fetchData } from "../../../utils/api"; // ✅ API Utility
import CustomerContext from "../../../context/CustomerContext"; // ✅ Import Context

export default function CustomerDashboard({ customerId, tenantId }) {
  const [customer, setCustomer] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFetching = useRef(false); // ✅ Prevent duplicate requests

  useEffect(() => {
    if (!customerId || !tenantId || isFetching.current) return;

    isFetching.current = true; // ✅ Mark API call as in-progress

    async function fetchCustomerAndDashboard() {
      try {
        // ✅ Headers including tenantId and Content-Type
        const headers = {
          "tenant": tenantId,
          "Content-Type": "application/json",
        };

        // ✅ Fetch Customer from Commerce7 API
        const customerResponse = await fetchData(
          "commerce7",
          `customer/${customerId}`,
          "GET",
          null,
          headers // ✅ Pass custom headers
        );
        setCustomer(customerResponse);

        // ✅ Fetch Dashboard Data from Affiliate API
        const dashboardResponse = await fetchData(
          "amazon",
          `affiliates/dashboard?tenantId=${tenantId}&customerId=${customerId}`,
          "GET",
          null,
          headers // ✅ Pass custom headers
        );
        setDashboardData(dashboardResponse);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error loading customer data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerAndDashboard();
  }, [customerId, tenantId]);

  return (
    <CustomerContext.Provider value={customer}>
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold">Customer Dashboard</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && customer && (
            <div className="mb-4">
              <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
              
              {/* ✅ Display all emails if available */}
              <p><strong>Emails:</strong></p>
              {customer.emails?.length > 0 ? (
                <ul className="list-disc list-inside">
                  {customer.emails.map((emailObj) => (
                    <li key={emailObj.id}>{emailObj.email} ({emailObj.status})</li>
                  ))}
                </ul>
              ) : (
                <p>No email available</p>
              )}
            </div>
          )}

          {!loading && dashboardData && (
            <div>
              <h2 className="text-lg font-bold">Referral Summary</h2>
              <p><strong>Total Referrals:</strong> {dashboardData?.totalReferrals || 0}</p>
              <p><strong>Total Orders:</strong> {dashboardData?.totalOrders || 0}</p>
              <p><strong>Total Commission Earned:</strong> ${dashboardData?.totalCommission || 0}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </CustomerContext.Provider>
  );
}
