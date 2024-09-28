// @ts-nocheck
import { getOrders } from "@/lib/orders";
import OrderTable from "./OrderTable";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
