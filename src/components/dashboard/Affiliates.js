import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { fetchData } from "../../utils/api"; // ✅ API Utility
import { Button } from "../ui/button"; // ✅ Import Button
import { RotateCw, PlusCircle, XCircle, Search } from "lucide-react"; // ✅ Import Icons

export default function Affiliates({ tenantId }) {
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]); // ✅ Store filtered affiliates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({}); // ✅ Track loading state for status updates

  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search filter state
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // ✅ Sorting: "asc" | "desc"

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);

  const isFetching = useRef(false); // ✅ Prevent duplicate requests

  // ✅ State for "Add Affiliate" Panel
  const [showAddAffiliate, setShowAddAffiliate] = useState(false);
  const [customerSearch, setCustomerSearch] = useState(""); // ✅ SECOND search
  const [searchResults, setSearchResults] = useState([]);
  const [addingAffiliate, setAddingAffiliate] = useState(false);
  const [affiliateSuccess, setAffiliateSuccess] = useState(null);
  const [affiliateError, setAffiliateError] = useState(null);

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

  // ✅ Handle Status Change
  const handleStatusChange = async (affiliateId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [affiliateId]: true })); // ✅ Set loading state

    try {
      const payload = {
        tenantId,
        affiliateId,
        status: newStatus,
      };

      await fetchData("amazon", "update-affiliate-status", "POST", payload);

      // ✅ Update UI with new status
      setFilteredAffiliates((prev) =>
        prev.map((aff) =>
          aff.affiliateId === affiliateId ? { ...aff, status: newStatus } : aff
        )
      );
    } catch (error) {
      console.error(`[Affiliates] Error updating status for ${affiliateId}:`, error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [affiliateId]: false })); // ✅ Clear loading state
    }
  };

  // ✅ Handle Second Search (For Customers in Add Affiliate Panel)
  useEffect(() => {
    if (customerSearch.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchCustomers = async () => {
      try {
        const headers = {
          tenant: tenantId,
          "Content-Type": "application/json",
        };
        const response = await fetchData("commerce7", `customer?q=${customerSearch}`, "GET", null, headers);
  
        // ✅ Filter out customers who already have an affiliateId in appData
        const filteredResults = (response.customers || []).filter((customer) => {
          const appData = customer.appData;
          const hasAffiliate =
            appData &&
            appData["affiliate-marketing"] &&
            appData["affiliate-marketing"].affiliateId;
  
          return !hasAffiliate; // ✅ Exclude customers who already have an affiliateId
        });
  
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("[Affiliates] Error fetching customers:", error);
      }
    };
  
    fetchCustomers();
  }, [customerSearch]);

  {/* ✅ Track the currently processing affiliate */}
  const [processingCustomerId, setProcessingCustomerId] = useState(null);

  const createAffiliate = async (customerId, name) => {
    setProcessingCustomerId(customerId); // ✅ Only update the clicked button
    setAffiliateSuccess(null);
    setAffiliateError(null);

    try {
      const payload = {
        tenantId,
        customerId,
        name,
      };

      await fetchData("amazon", "affiliate", "POST", payload);

      setAffiliateSuccess("Affiliate created successfully!");
      setCustomerSearch("");
      setSearchResults([]);
      fetchAffiliates();
    } catch (error) {
      setAffiliateError("Failed to create affiliate. Please try again.");
    } finally {
      setProcessingCustomerId(null); // ✅ Reset after API call
    }
  };

  // ✅ Cancel and OK Add Affiliate & Reset
  const closeAddAffiliate = () => {
    setShowAddAffiliate(false);
    setCustomerSearch("");
    setSearchResults([]);
    setAffiliateSuccess(null);
    setAffiliateError(null);
  };

  // ✅ Calculate Paginated Data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAffiliates = filteredAffiliates.slice(startIndex, endIndex);

  return (
    <Card>
      <CardContent>
        {/* ✅ Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Affiliates Management</h2>
          <div className="flex gap-2">
            {!showAddAffiliate && (
              <Button 
                onClick={() => setShowAddAffiliate(true)} 
                variant="outline" 
                className="inline-flex items-center px-3 py-2"
              >
                <PlusCircle className="w-5 h-5 mr-1 align-middle" />
                <span className="align-middle">Add Affiliate</span>
              </Button>
            )}
          </div>
        </div>

        {/* ✅ Add Affiliate Panel (Second Search) */}
        {showAddAffiliate && (
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 mb-4">

            {/* ✅ Header & Cancel Button */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Search for a Customer</h3>
              <Button 
                onClick={closeAddAffiliate} 
                variant="outline" 
                className="inline-flex items-center px-3 py-2"
              >
                <XCircle className="w-5 h-5 mr-1 align-middle" />
                <span className="align-middle">Cancel</span>
              </Button>
            </div>
        
            {/* ✅ Search Field (Magnifying glass inside input) */}
            <div className="relative w-full max-w-lg mb-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, etc."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-12 pr-4 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* ✅ Search Results */}
            {searchResults.length > 0 && (
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td>{customer.firstName} {customer.lastName}</td>
                      <td>
                        {/* ✅ Display all emails, separated by commas */}
                        {customer.emails?.length > 0 
                          ? customer.emails.map((emailObj) => emailObj.email).join(", ") 
                          : "No email available"}
                      </td>
                      <td>
                        <Button 
                          onClick={() => createAffiliate(customer.id, `${customer.firstName} ${customer.lastName}`)} 
                          disabled={processingCustomerId === customer.id} // ✅ Disable only the clicked button
                        >
                          {processingCustomerId === customer.id ? "Processing..." : "Create Affiliate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ✅ Success/Error Messages */}
            {affiliateSuccess && <p className="text-green-600 font-bold mt-2">{affiliateSuccess}</p>}
            {affiliateError && <p className="text-red-500 font-bold mt-2">{affiliateError}</p>}
            {affiliateSuccess && <Button onClick={() => closeAddAffiliate()}>OK</Button>}
          </div>
        )}

        {!showAddAffiliate && (
          <div>
            {/* ✅ Search Box */}
            <input
              type="text"
              placeholder="Search by Affiliate ID, Name, Customer ID, Status, Created At..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-product"
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
                  <Button onClick={fetchAffiliates} disabled={loading} variant="outline">
                    <RotateCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                  </Button>
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
                        <td className="border border-gray-300 px-4 py-2 break-words min-w-[150px]">{affiliate.customerId}</td>
                        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">
                          <select
                            value={affiliate.status}
                            onChange={(e) => handleStatusChange(affiliate.affiliateId, e.target.value)}
                            disabled={updatingStatus[affiliate.affiliateId]}
                            className="border border-gray-300 rounded-md p-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Deleted">Deleted</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(affiliate.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* ✅ Pagination Controls */}
                <div className="pagination-container">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
