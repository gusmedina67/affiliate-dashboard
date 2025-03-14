import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { fetchData } from "../../utils/api";

export default function Commissions({ tenantId }) {
  const [commissionProgram, setCommissionProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commissionType, setCommissionType] = useState("default");
  const [defaultRate, setDefaultRate] = useState(5.2);
  const [products, setProducts] = useState([]);
  const [productCursor, setProductCursor] = useState(null);
  const [previousCursors, setPreviousCursors] = useState([]);
  const [updatedRates, setUpdatedRates] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  const isFetching = useRef(false);

  useEffect(() => {
    if (!tenantId || isFetching.current) return;
    isFetching.current = true;

    async function fetchCommissionProgram() {
      try {
        const response = await fetchData(
          "amazon",
          `commission-program?tenantId=${tenantId}`,
          "GET"
        );

        if (response.error) {
          setCommissionProgram(null);
        } else {
          setCommissionProgram(response);
          setCommissionType(response.commissionType || "default");
          setDefaultRate(response.defaultRate || 5.2);

          if (response.commissionType === "per_product") {
            fetchProducts("start");
          }
        }
      } catch (err) {
        console.error("[Commissions] Error fetching commission program:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCommissionProgram();
  }, [tenantId]);

  const fetchProducts = async (cursor = "start") => {
    if (isSearching) return;

    try {
      const headers = {
        tenant: tenantId,
        "Content-Type": "application/json",
      };

      const response = await fetchData(
        "commerce7",
        `product?adminStatus=Available&cursor=${cursor}`,
        "GET",
        null,
        headers
      );

      setProducts(response.products || []);
      setProductCursor(response.cursor || null);
      setUpdatedRates({});
      setUpdateErrors({});

      if (cursor !== "start") {
        setPreviousCursors((prev) => [...prev, cursor]);
      }
    } catch (err) {
      console.error("[Commissions] Error fetching products:", err);
      setError(err.message);
    }
  };

  const handleCommissionTypeChange = async (newType) => {
    setCommissionType(newType);

    try {
      const payload = {
        tenantId,
        commissionType: newType,
        defaultRate: newType === "default" ? parseFloat(defaultRate) : undefined,
      };

      const response = await fetchData("amazon", "commission-program", "POST", payload);
      setCommissionProgram(response);
      setError(null);

      if (newType === "per_product") {
        fetchProducts("start");
      }
    } catch (err) {
      console.error("[Commissions] Error updating commission type:", err);
      setError(err.message);
    }
  };

  const handleDefaultRateUpdate = async () => {
    try {
      const payload = {
        tenantId,
        commissionType: "default",
        defaultRate: parseFloat(defaultRate),
      };

      const response = await fetchData("amazon", "commission-program", "POST", payload);
      setCommissionProgram(response);
      setError(null);
    } catch (err) {
      console.error("[Commissions] Error updating default rate:", err);
      setError(err.message);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length < 3) {
      setIsSearching(false);
      fetchProducts("start");
      return;
    }

    setIsSearching(true);

    try {
      const headers = {
        tenant: tenantId,
        "Content-Type": "application/json",
      };

      const response = await fetchData(
        "commerce7",
        `product?q=${query}`,
        "GET",
        null,
        headers
      );

      setProducts(response.products || []);
    } catch (err) {
      console.error("[Commissions] Error searching products:", err);
      setError(err.message);
    }
  };

  const handleRateChange = (productId, value) => {
    setUpdatedRates((prev) => ({ ...prev, [productId]: value }));
    setUpdateErrors((prev) => ({ ...prev, [productId]: null }));
  };

  const saveCommissionRate = async (productId) => {
    if (!updatedRates[productId]) return;

    try {
      const payload = {
        appData: {
          commissionRate: parseFloat(updatedRates[productId]),          
        },
      };

      const headers = {
        tenant: tenantId,
        "Content-Type": "application/json",
      };

      await fetchData("commerce7", `product/${productId}`, "PUT", payload, headers);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                appData: {
                  "affiliate-marketing": {
                    commissionRate: parseFloat(updatedRates[productId]),
                  },
                },
              }
            : product
        )
      );

      setUpdateErrors((prev) => ({ ...prev, [productId]: null }));
    } catch (err) {
      console.error(`[Commissions] Error updating commission rate for ${productId}:`, err);
      setUpdateErrors((prev) => ({
        ...prev,
        [productId]: "Failed to update. Please try again.",
      }));
    }
  };

  /** ✅ Handle Blur and Keyboard Events for Auto-Saving */
  const handleInputBlur = (productId) => {
    saveCommissionRate(productId);
  };

  const handleKeyDown = (e, productId, index) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <Card>
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">Commissions Settings</h1>

        {loading && <p>Loading commission program...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Commission Type:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={commissionType}
              onChange={(e) => handleCommissionTypeChange(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="per_product">Per Product</option>
            </select>

            {/* ✅ Restored Default Rate Input Field */}
            {commissionType === "default" && (
              <div>
                <label className="block mt-2 text-sm font-medium text-gray-700">
                  Default Rate (%):
                </label>
                <Input
                  type="number"
                  value={defaultRate}
                  onChange={(e) => setDefaultRate(e.target.value)}
                  onBlur={handleDefaultRateUpdate}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>
        )}

        {commissionType === "per_product" && (
          <div>
            <Input
              type="text"
              placeholder="Search products..."
              className="search-product"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
                <tr className="bg-gray-100">
                  <th>Product ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Commission Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.type}</td>
                    <td>
                      <Input
                        type="number"
                        data-index={index}
                        value={updatedRates[product.id] ??
                          product.appData?.["affiliate-marketing"]?.commissionRate ?? ""}
                        onChange={(e) => handleRateChange(product.id, e.target.value)}
                        onBlur={() => handleInputBlur(product.id)}
                        onKeyDown={(e) => handleKeyDown(e, product.id, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Pagination Logic (YOUR VERSION) */}
            {!isSearching && (
              <div className="pagination-container">
                <Button disabled={previousCursors.length === 0} onClick={() => {
                  const prevCursor = previousCursors[previousCursors.length - 2] || "start";
                  setPreviousCursors((prev) => prev.slice(0, -1));
                  fetchProducts(prevCursor);
                }}>
                  Previous
                </Button>
                <p className="pagination-text">Showing {products.length} products</p>
                <Button disabled={!productCursor} onClick={() => fetchProducts(productCursor)}>Next</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
