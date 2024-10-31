import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import prisma from "@/lib/prisma";

const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL =
  process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg/orders";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const response = await axios.get(`${CASHFREE_API_URL}/${orderId}`, {
      headers: {
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
    });

    const paymentStatus = response.data.order_status;

    if (paymentStatus === "PAID") {
      await prisma.order.update({
        where: { id: orderId.replace("order_", "") },
        data: { status: "PAID" },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
