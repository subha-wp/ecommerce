/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

type OrderHistoryProps = {
  userId: string;
};

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order history. Please try again.",
        variant: "destructive",
      });
    }
  };
  console.log(orders);

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-2xl font-semibold">Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 rounded border p-4">
          <p className="font-semibold">Order ID: {order.id}</p>
          {/* <p>Total: ₹{order.total.toFixed(2)}</p> */}
          <p>Status: {order.status}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <details>
            <summary className="cursor-pointer text-blue-600">
              View Items
            </summary>
            <ul className="mt-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  Product Name: {item.product.title.substring(0, 20)}...,
                  Quantity: {item.quantity}, Price: ₹{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
