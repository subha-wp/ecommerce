//@ts-nocheck
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderList } from "./OrderList";

export default async function OrdersPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View and track all your orders
        </p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
