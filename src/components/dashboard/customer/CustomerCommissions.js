import { useState, useEffect } from "react";
import { Table } from "../../ui/table";

export default function CustomerCommissions({ customerId, tenantId }) {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    fetch(`/api/commissions?tenantId=${tenantId}&customerId=${customerId}`)
      .then(res => res.json())
      .then(setCommissions)
      .catch((err) => console.error("Error fetching commissions:", err));
  }, [customerId, tenantId]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Payout ID</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {commissions.map(comm => (
          <tr key={comm.payoutId}>
            <td>{comm.payoutId}</td>
            <td>${comm.amount}</td>
            <td>{comm.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
