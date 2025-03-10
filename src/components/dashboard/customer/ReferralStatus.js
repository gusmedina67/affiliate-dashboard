
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { fetchData } from "../../../utils/api"; // ✅ API Utility
// import "../../App.css";

export default function ReferralStatus({ customerId, tenantId }) {
  const [affiliate, setAffiliate] = useState(null);
  const [trackingLink, setTrackingLink] = useState("");

  useEffect(() => {
    // ✅ Fetch Affiliate Details
    async function fetchAffiliate() {
      try {
        const response = await fetchData("amazon", "affiliate", "POST", {
          tenantId,
          customerId,
          name: "Stacey Gou", // Placeholder name, ideally should be dynamic
        });
        setAffiliate(response);
      } catch (error) {
        console.error("Error fetching affiliate details:", error);
      }
    }

    fetchAffiliate();
  }, [customerId, tenantId]);

  // ✅ Generate Referral Link
  const generateReferral = async () => {
    if (!affiliate?.affiliateId) {
      console.error("Affiliate ID is missing!");
      return;
    }

    try {
      const response = await fetchData("amazon", "generate-affiliate-link", "POST", {
        tenantId,
        affiliateId: affiliate.affiliateId,
      });
      setTrackingLink(response.trackingLink);
    } catch (error) {
      console.error("Error generating referral link:", error);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-bold">Affiliate Information</h2>
        
        {affiliate ? (
          <div>
            <p><strong>Name:</strong> {affiliate.name}</p>
            <p><strong>Affiliate ID:</strong> {affiliate.affiliateId}</p>
            <p><strong>Status:</strong> {affiliate.status}</p>
          </div>
        ) : (
          <p>Loading affiliate details...</p>
        )}

        <h2 className="text-lg font-bold mt-4">Generate Referral Link</h2>
        <Button onClick={generateReferral} disabled={!affiliate}>Generate Link</Button>

        {trackingLink && (
          <p className="mt-2">
            <strong>Referral Link:</strong> <a href={trackingLink} target="_blank" className="text-blue-600">{trackingLink}</a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

