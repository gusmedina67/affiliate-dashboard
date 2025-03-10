import { useState, useEffect } from "react";
import { Table } from "../../ui/table";

export default function CustomerOrders({ customerId, tenantId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`/api/orders?tenantId=${tenantId}&customerId=${customerId}`)
      .then(res => res.json())
      .then(setOrders)
      .catch((err) => console.error("Error fetching orders:", err));
  }, [customerId, tenantId]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.orderId}>
            <td>{order.orderId}</td>
            <td>{order.date}</td>
            <td>${order.amount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
