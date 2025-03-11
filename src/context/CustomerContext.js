import { createContext, useContext } from "react";

// ✅ Create Global Customer Context
const CustomerContext = createContext(null);

// ✅ Hook to use the Customer Context
export function useCustomer() {
  return useContext(CustomerContext);
}

export default CustomerContext;
