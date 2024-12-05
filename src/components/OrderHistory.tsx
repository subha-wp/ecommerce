"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
  };
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h2 className="mb-4 text-2xl font-semibold">Order History</h2>
      {orders.map((order) => (
        <Sheet key={order.id}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSelectedOrder(order)}
            >
              <Card className="w-full">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="text-left">
                    <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(order.total ?? 0).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[80vh] sm:h-full sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
              <SheetDescription>
                Order #{selectedOrder?.id.slice(-6)}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
              {selectedOrder && (
                <div className="mt-4 space-y-4">
                  <p>Date: {formatDate(selectedOrder.createdAt)}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total: ₹{(selectedOrder.total ?? 0).toFixed(2)}</p>
                  <h3 className="mt-4 font-semibold">Items:</h3>
                  <ul className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <li key={item.id} className="border-b pb-2">
                        <p>{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}, Price: ₹
                          {item.price.toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
