// @ts-nocheck
import { getCustomers } from "@/lib/customers";
import CustomerTable from "./CustomerTable";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Customers</h1>
      <CustomerTable customers={customers} />
    </div>
  );
}
