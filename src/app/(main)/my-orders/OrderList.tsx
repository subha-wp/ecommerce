//@ts-nocheck
"use client";

import { useState } from "react";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetails } from "@/components/orders/OrderDetails";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
  };
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
};

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
        <h3 className="text-lg font-medium">No orders yet</h3>
        <p className="text-sm text-muted-foreground">
          When you place an order, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={() => setSelectedOrder(order)}
        />
      ))}
      <OrderDetails
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
