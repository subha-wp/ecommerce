//@ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvoiceButton from "./InvoiceButton";
import { generateInvoiceContent } from "./InvoicePDF";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    description: string;
  };
};

type Address = {
  id: string;
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  addressId: string;
  status: string;
  paymentMode: string | null;
  createdAt: string;
  updatedAt: string;
  total: number;
};

export default function OrderTable({
  orders: initialOrders,
}: {
  orders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order,
        ),
      );

      toast({
        title: "Order status updated",
        description: `Order ${id} status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description:
          "There was an error updating the order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateInvoice = (order: Order, type: "invoice" | "challan") => {
    generateInvoiceContent(order, type);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.address.name}</TableCell>
              <TableCell>{order.status || "Pending"}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>₹{order.total.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) =>
                      handleUpdateStatus(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                  <InvoiceButton
                    order={order}
                    type="invoice"
                    onGenerate={() => handleGenerateInvoice(order, "invoice")}
                  />

                  <InvoiceButton
                    order={order}
                    type="challan"
                    onGenerate={() => handleGenerateInvoice(order, "challan")}
                  />

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl bg-white">
                      <DialogHeader>
                        <DialogTitle>Order Details - {order.id}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">
                            Customer Details
                          </h3>
                          <p>
                            <strong>Name:</strong> {order.address.name}
                          </p>
                          <p>
                            <strong>Phone:</strong> {order.address.phoneNumber}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {order.address.addressLine1}
                            {order.address.addressLine2 && (
                              <>, {order.address.addressLine2}</>
                            )}
                          </p>
                          <p>
                            <strong>City:</strong> {order.address.city}
                          </p>
                          <p>
                            <strong>State:</strong> {order.address.state}
                          </p>
                          <p>
                            <strong>ZIP:</strong> {order.address.zipCode}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">
                            Order Summary
                          </h3>
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p>
                            <strong>Status:</strong> {order.status || "Pending"}
                          </p>
                          <p>
                            <strong>Payment Mode:</strong>{" "}
                            {order.paymentMode || "N/A"}
                          </p>
                          <p>
                            <strong>Total:</strong> ₹{order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="mb-2 text-lg font-semibold">
                          Order Items
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.product.title}</TableCell>
                                <TableCell>
                                  {item.product.description.substring(0, 50)}...
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
