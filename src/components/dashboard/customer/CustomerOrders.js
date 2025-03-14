import { useState, useEffect, useRef } from "react";
import { Table } from "../../ui/table";
import { Button } from "../../ui/button";
import { fetchData } from "../../../utils/api"; // ✅ Using the standard fetch function

export default function CustomerOrders({ customerId, tenantId }) {
  const [orders, setOrders] = useState([]);
  const [cursor, setCursor] = useState("start"); // ✅ Cursor for pagination
  const [prevCursors, setPrevCursors] = useState([]); // ✅ Track previous cursors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFetching = useRef(false); // ✅ Prevent duplicate requests

  useEffect(() => {
    fetchOrders(cursor);
  }, [cursor]); // ✅ Fetch when cursor changes

  const fetchOrders = async (cursorValue) => {
    if (!tenantId || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const headers = {
        tenant: tenantId,
        "Content-Type": "application/json",
      };

      const data = await fetchData(
        "commerce7",
        `order?customerId=${customerId}&cursor=${cursorValue}`,
        "GET",
        null,
        headers
      );

      if (!data.orders) throw new Error("No orders found");

      // ✅ Filter only orders that have the "affiliate-marketing" appData
      const filteredOrders = data.orders.filter(
        (order) =>
          order.appData &&
          order.appData["affiliate-marketing"] &&
          order.appData["affiliate-marketing"].affiliateId
      );

      setOrders(filteredOrders);

      // ✅ Update pagination state
      if (cursorValue !== "start") {
        setPrevCursors((prev) => [...prev, cursor]); // Store previous cursor
      }
      setCursor(data.cursor || null); // Store next cursor (if available)

    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format date as "MM dd, yyyy hh:mm am/pm"
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Format price (convert cents to dollars)
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Customer Orders (Affiliate Orders Only)</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>No affiliate orders found for this customer.</p>
      )}

      {!loading && orders.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Paid Date</th>
                <th>Customer</th>
                <th>Channel</th>
                <th># Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{formatDate(order.orderPaidDate)}</td>
                  <td>{`${order.customer?.firstName || "N/A"} ${order.customer?.lastName || ""}`}</td>
                  <td>{order.channel || "N/A"}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>{formatCurrency(order.totalAfterTip)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* ✅ Pagination Controls */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCursor(prevCursors.pop() || "start")}
              disabled={prevCursors.length === 0}
            >
              Previous
            </Button>

            <span className="text-sm">
              Showing {orders.length} affiliate orders
            </span>

            <Button
              onClick={() => cursor && fetchOrders(cursor)}
              disabled={!cursor}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
