import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";

export default function CustomerDashboard({ customerId, tenantId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/affiliates/dashboard?tenantId=${tenantId}&customerId=${customerId}`)
      .then(res => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [customerId, tenantId]);

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-bold">Referral Summary</h2>
        <p>Total Referrals: {data?.totalReferrals || 0}</p>
        <p>Total Orders: {data?.totalOrders || 0}</p>
        <p>Total Commission Earned: ${data?.totalCommission || 0}</p>
      </CardContent>
    </Card>
  );
}
