import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import axios from "axios";
import prisma from "@/lib/prisma";

const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL =
  process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg/orders";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, items, totalAmount } = await req.json();

    // Get address details to get phone number
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Create the order in your database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        totalAmount,
        paymentMode: "ONLINE",
        status: "PENDING",
      },
    });

    // Initiate payment with Cashfree
    const orderId = `order_${order.id}`;
    const paymentResponse = await axios.post(
      CASHFREE_API_URL,
      {
        order_id: orderId,
        order_amount: totalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id,
          customer_email: user.email,
          customer_phone: address.phoneNumber, // Use phone number from shipping address
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback?order_id=${orderId}`,
        },
      },
      {
        headers: {
          "x-client-id": CASHFREE_API_KEY,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      },
    );

    // Update the order with the payment link
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentResponse.data.cf_order_id.toString() },
    });

    return NextResponse.json({
      paymentLink: paymentResponse.data.payment_link,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
