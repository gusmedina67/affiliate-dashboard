import { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { fetchData } from "../../../utils/api"; // ✅ API Utility
import { useCustomer } from "../../../context/CustomerContext"; // ✅ Import the correct CustomerContext hook


export default function ReferralStatus({ customerId, tenantId }) {
  const [affiliate, setAffiliate] = useState(null);
  const [trackingLink, setTrackingLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // ✅ Status selection

  const customer = useCustomer(); // ✅ Get customer data from context
  const isFetching = useRef(false); // ✅ Prevent duplicate requests

  useEffect(() => {
    if (!customerId || !tenantId || isFetching.current) return;

    isFetching.current = true; // ✅ Mark API call as in-progress

    async function checkAffiliate() {
      try {
        const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}&customerId=${customerId}`, "GET");
        if (response.length > 0) {
          setAffiliate(response[0]);
          setSelectedStatus(response[0].status); // ✅ Pre-set dropdown value
        }
      } catch (err) {
        console.error("Error checking affiliate:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    checkAffiliate();
  }, [customerId, tenantId]);

  // ✅ Create a new affiliate if none exists
  const createAffiliate = async () => {
    // if (!customer) {
    //   console.error("Customer data is not available!");
    //   setError("Customer data is required to create an affiliate.");
    //   return;
    // }

    // const fullName = `${customer.firstName} ${customer.lastName}`.trim(); // ✅ Use real customer name

    setLoading(true);
    try {
      const response = await fetchData("amazon", "affiliate", "POST", {
        tenantId,
        customerId,
        name: "Unknown Customer", // ✅ Use dynamic name
      });
      setAffiliate(response);
      setSelectedStatus(response.status); // ✅ Set initial status
    } catch (err) {
      console.error("Error creating affiliate:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate Referral Link (Only if Active)
  const generateReferral = async () => {
    if (!affiliate?.affiliateId || affiliate.status !== "Active") {
      console.error("Affiliate must be Active to generate a referral link!");
      return;
    }

    try {
      const response = await fetchData("amazon", "generate-affiliate-link", "POST", {
        tenantId,
        affiliateId: affiliate.affiliateId,
      });
      setTrackingLink(response.trackingLink);
    } catch (err) {
      console.error("Error generating referral link:", err);
      setError(err.message);
    }
  };

  // ✅ Update Affiliate Status (Only if status changes)
  const updateAffiliateStatus = async () => {
    if (!affiliate?.affiliateId || selectedStatus === affiliate.status) {
      console.error("No changes detected or missing affiliate ID!");
      return;
    }

    try {
      await fetchData("amazon", "update-affiliate-status", "POST", {
        tenantId,
        affiliateId: affiliate.affiliateId,
        status: selectedStatus,
      });

      setAffiliate((prev) => ({ ...prev, status: selectedStatus })); // ✅ Update UI
      setTrackingLink(""); // ✅ Reset referral link if status changes
    } catch (err) {
      console.error("Error updating affiliate status:", err);
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-bold">Affiliate Information</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !affiliate && (
          <div>
            <p>This customer is not an affiliate yet.</p>
            <Button onClick={createAffiliate}>Create Affiliate</Button>
          </div>
        )}

        {!loading && affiliate && (
          <>
            <div>
              <p><strong>Name:</strong> {affiliate.name}</p>
              <p><strong>Affiliate ID:</strong> {affiliate.affiliateId}</p>
              <p><strong>Status:</strong> {affiliate.status}</p>

              {/* ✅ Status Dropdown */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Update Status:
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Deleted">Deleted</option>
                </select>
                <Button
                  className="mt-2"
                  onClick={updateAffiliateStatus}
                  disabled={selectedStatus === affiliate.status} // ✅ Disable if no change
                >
                  Update Status
                </Button>
              </div>
            </div>

            <h2 className="text-lg font-bold mt-4">Generate Referral Link</h2>
            <Button onClick={generateReferral} disabled={affiliate.status !== "Active"}>
              Generate Link
            </Button>

            {trackingLink && (
              <p className="mt-2">
                <strong>Referral Link:</strong>{" "}
                <a href={trackingLink} target="_blank" className="text-blue-600">
                  {trackingLink}
                </a>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// import { useState, useEffect } from "react";
// import { Button } from "../../ui/button";
// import { Card, CardContent } from "../../ui/card";
// import { fetchData } from "../../../utils/api"; // ✅ API Utility
// // import "../../App.css";

// export default function ReferralStatus({ customerId, tenantId }) {
//   const [affiliate, setAffiliate] = useState(null);
//   const [trackingLink, setTrackingLink] = useState("");

//   useEffect(() => {
//     // ✅ Fetch Affiliate Details
//     async function fetchAffiliate() {
//       try {
//         const response = await fetchData("amazon", "affiliate", "POST", {
//           tenantId,
//           customerId,
//           name: "Stacey Gou", // Placeholder name, ideally should be dynamic
//         });
//         setAffiliate(response);
//       } catch (error) {
//         console.error("Error fetching affiliate details:", error);
//       }
//     }

//     fetchAffiliate();
//   }, [customerId, tenantId]);

//   // ✅ Generate Referral Link
//   const generateReferral = async () => {
//     if (!affiliate?.affiliateId) {
//       console.error("Affiliate ID is missing!");
//       return;
//     }

//     try {
//       const response = await fetchData("amazon", "generate-affiliate-link", "POST", {
//         tenantId,
//         affiliateId: affiliate.affiliateId,
//       });
//       setTrackingLink(response.trackingLink);
//     } catch (error) {
//       console.error("Error generating referral link:", error);
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <h2 className="text-lg font-bold">Affiliate Information</h2>
        
//         {affiliate ? (
//           <div>
//             <p><strong>Name:</strong> {affiliate.name}</p>
//             <p><strong>Affiliate ID:</strong> {affiliate.affiliateId}</p>
//             <p><strong>Status:</strong> {affiliate.status}</p>
//           </div>
//         ) : (
//           <p>Loading affiliate details...</p>
//         )}

//         <h2 className="text-lg font-bold mt-4">Generate Referral Link</h2>
//         <Button onClick={generateReferral} disabled={!affiliate}>Generate Link</Button>

//         {trackingLink && (
//           <p className="mt-2">
//             <strong>Referral Link:</strong> <a href={trackingLink} target="_blank" className="text-blue-600">{trackingLink}</a>
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

