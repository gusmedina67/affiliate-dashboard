import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { fetchData } from "../../utils/api"; // ✅ API Utility
import { Button } from "../ui/button"; // ✅ Import Button
import { RotateCw } from "lucide-react"; // ✅ Import Refresh Icon (Circle Arrow)

export default function Affiliates({ tenantId }) {
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]); // ✅ Store filtered affiliates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search filter state
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // ✅ Sorting: "asc" | "desc"

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);

  const isFetching = useRef(false); // ✅ Prevent duplicate requests

  const fetchAffiliates = async () => {
    if (!tenantId || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}`, "GET");
      setAffiliates(response);
      setFilteredAffiliates(response); // ✅ Set initial filtered data
    } catch (error) {
      console.error("[Affiliates] Error fetching affiliates:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [tenantId]);

  // ✅ Handle Search (Now includes Affiliate ID & Created At)
  useEffect(() => {
    const filtered = affiliates.filter((aff) =>
      aff.affiliateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(aff.createdAt).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAffiliates(filtered);
    setCurrentPage(1); // ✅ Reset to first page after search
  }, [searchTerm, affiliates]);

  // ✅ Handle Sorting
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredAffiliates].sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase();
      const valueB = b[field]?.toString().toLowerCase();

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAffiliates(sorted);
  };

  // ✅ Calculate Paginated Data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAffiliates = filteredAffiliates.slice(startIndex, endIndex);

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Affiliates Management</h2>

          {/* ✅ Refresh Button with Icon (Moved to the right) */}
          <Button onClick={fetchAffiliates} disabled={loading} variant="outline" className="p-2">
            <RotateCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* ✅ Search Box */}
        <input
          type="text"
          placeholder="Search by Affiliate ID, Name, Customer ID, Status, Created At..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        {loading && <p>Loading affiliates...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && filteredAffiliates.length === 0 && (
          <p>No affiliates found for this tenant.</p>
        )}

        {!loading && !error && filteredAffiliates.length > 0 && (
          <>
            {/* ✅ Items per Page Dropdown */}
            <div className="mb-4">
              <label className="mr-2">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md p-1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            {/* ✅ Affiliates Table */}
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  {["affiliateId", "name", "customerId", "status", "createdAt"].map((field) => (
                    <th
                      key={field}
                      className="border border-gray-300 px-4 py-2 cursor-pointer"
                      onClick={() => handleSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedAffiliates.map((affiliate) => (
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

            {/* ✅ Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}


// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent } from "../ui/card";
// import { fetchData } from "../../utils/api"; // ✅ Updated to Use Axios

// export default function Affiliates({ tenantId }) {
//   const [affiliates, setAffiliates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const isFetching = useRef(false);  // ✅ Prevent duplicate requests

//   useEffect(() => {
//     if (!tenantId || isFetching.current) return;  // ✅ Stop duplicate calls

//     isFetching.current = true;  // ✅ Mark API call as in-progress

//     async function fetchAffiliates() {
//       try {
//         const response = await fetchData("amazon", `affiliates?tenantId=${tenantId}`, "GET");
//         setAffiliates(response);
//       } catch (error) {
//         console.error("[Affiliates] Error fetching affiliates:", error);
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
