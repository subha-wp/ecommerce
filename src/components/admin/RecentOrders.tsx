"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentOrders = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    amount: 2599,
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@example.com",
    amount: 1399,
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@example.com",
    amount: 999,
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha@example.com",
    amount: 3299,
  },
  {
    id: "5",
    name: "Vikram Shah",
    email: "vikram@example.com",
    amount: 1899,
  },
];

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.name}</p>
            <p className="text-sm text-muted-foreground">{order.email}</p>
          </div>
          <div className="ml-auto font-medium">+₹{order.amount}</div>
        </div>
      ))}
    </div>
  );
}
