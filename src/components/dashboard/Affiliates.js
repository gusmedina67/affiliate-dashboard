import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { fetchData } from "../../utils/api"; // ✅ Updated to Use Axios

export default function Affiliates({ tenantId }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isFetching = useRef(false);  // ✅ Prevent duplicate requests

  useEffect(() => {
    if (!tenantId || isFetching.current) return;  // ✅ Stop duplicate calls

    isFetching.current = true;  // ✅ Mark API call as in-progress

    async function fetchAffiliates() {
      try {
        const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}`, "GET");
        setAffiliates(response);
      } catch (error) {
        console.error("[Affiliates] Error fetching affiliates:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, [tenantId]);

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-bold">Affiliates Management</h2>

        {loading && <p>Loading affiliates...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && affiliates.length === 0 && (
          <p>No affiliates found for this tenant.</p>
        )}

        {!loading && !error && affiliates.length > 0 && (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Affiliate ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Customer ID</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.affiliateId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{affiliate.affiliateId}</td>
                  <td className="border border-gray-300 px-4 py-2">{affiliate.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{affiliate.customerId}</td>
                  <td className="border border-gray-300 px-4 py-2">{affiliate.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(affiliate.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}



// import { useState, useEffect } from "react";
// import { Card, CardContent } from "../ui/card";
// import { fetchData } from "../../utils/api"; // ✅ API Utility

// export default function Affiliates({ tenantId }) {
//   const [affiliates, setAffiliates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!tenantId) return;

//     async function fetchAffiliates() {
//       try {
//         // ✅ Use the updated fetch function with proper headers
//         const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}`, "GET");
//         setAffiliates(response);
//       } catch (error) {
//         console.error("Error fetching affiliates:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAffiliates();
//   }, [tenantId]);

//   return (
//     <Card>
//       <CardContent>
//         <h2 className="text-lg font-bold">Affiliates Management</h2>

//         {loading && <p>Loading affiliates...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {!loading && !error && affiliates.length === 0 && (
//           <p>No affiliates found for this tenant.</p>
//         )}

//         {!loading && !error && affiliates.length > 0 && (
//           <table className="w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">Affiliate ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Name</th>
//                 <th className="border border-gray-300 px-4 py-2">Customer ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Status</th>
//                 <th className="border border-gray-300 px-4 py-2">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {affiliates.map((affiliate) => (
//                 <tr key={affiliate.affiliateId} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">{affiliate.affiliateId}</td>
//                   <td className="border border-gray-300 px-4 py-2">{affiliate.name}</td>
//                   <td className="border border-gray-300 px-4 py-2">{affiliate.customerId}</td>
//                   <td className="border border-gray-300 px-4 py-2">{affiliate.status}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {new Date(affiliate.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



// import { useState, useEffect } from "react";
// import $ from "jquery"; // ✅ Import jQuery
// import { Card, CardContent } from "../ui/card";
// import CONFIG from "../../config";

// export default function Affiliates({ tenantId }) {
//   const [affiliates, setAffiliates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!tenantId) return;

//     async function fetchAffiliates() {
//       setLoading(true);
//       setError(null);

//       const url = `${CONFIG.AMAZON_API_BASE_URL}/affiliates?tenantId=${tenantId}`;

//       $.ajax({
//         url,
//         method: "GET",
//         dataType: "json",
//         headers: {
//           "Authorization": "Basic " + btoa(`${CONFIG.AMAZON_API_USERNAME}:${CONFIG.AMAZON_API_PASSWORD}`),
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         success: function (data) {
//           console.log("API Response:", data);
//           setAffiliates(data);
//         },
//         error: function (xhr, status, error) {
//           console.error("Error fetching affiliates:", error);
//           setError(`API Error: ${xhr.status} - ${xhr.statusText}`);
//         },
//         complete: function () {
//           setLoading(false);
//         },
//       });
//     }

//     fetchAffiliates();
//   }, [tenantId]);

//   return (
//     <Card>
//       <CardContent>
//         <h2 className="text-lg font-bold">Affiliates Management</h2>

//         {loading && <p>Loading affiliates...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {!loading && !error && affiliates.length === 0 && (
//           <p>No affiliates found for this tenant.</p>
//         )}

//         {!loading && !error && affiliates.length > 0 && (
//           <table className="w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">Affiliate ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Name</th>
//                 <th className="border border-gray-300 px-4 py-2">Customer ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Status</th>
//                 <th className="border border-gray-300 px-4 py-2">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {affiliates.map((affiliate) => (
//                 <tr key={affiliate.affiliateId} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.affiliateId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.name}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.customerId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.status}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {new Date(affiliate.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }




// import { useState, useEffect } from "react";
// import { Card, CardContent } from "../ui/card";
// import { fetchData } from "../../utils/api"; // ✅ API Utility

// export default function Affiliates({ tenantId }) {
//   const [affiliates, setAffiliates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!tenantId) return;

//     async function fetchAffiliates() {
//       try {
//         // ✅ Fetch affiliates using `fetchData`
//         const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}`, "GET");
//         setAffiliates(response);
//       } catch (error) {
//         console.error("Error fetching affiliates:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAffiliates();
//   }, [tenantId]);

//   return (
//     <Card>
//       <CardContent>
//         <h2 className="text-lg font-bold">Affiliates Management</h2>

//         {loading && <p>Loading affiliates...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {!loading && !error && affiliates.length === 0 && (
//           <p>No affiliates found for this tenant.</p>
//         )}

//         {!loading && !error && affiliates.length > 0 && (
//           <table className="w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">Affiliate ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Name</th>
//                 <th className="border border-gray-300 px-4 py-2">Customer ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Status</th>
//                 <th className="border border-gray-300 px-4 py-2">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {affiliates.map((affiliate) => (
//                 <tr key={affiliate.affiliateId} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.affiliateId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.name}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.customerId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {affiliate.status}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {new Date(affiliate.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
