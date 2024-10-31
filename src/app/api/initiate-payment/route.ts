import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import axios from "axios";
import prisma from "@/lib/prisma";

const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (
      !CASHFREE_API_KEY ||
      !CASHFREE_SECRET_KEY ||
      !CASHFREE_API_URL ||
      !NEXT_PUBLIC_BASE_URL
    ) {
      console.error("Missing Cashfree API credentials or configuration");
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 },
      );
    }

    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, items, totalAmount } = await req.json();

    if (!addressId || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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

    // Prepare the order payload for Cashfree
    const orderId = `order_${order.id}`;
    const payload = {
      order_id: orderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: user.id,
        customer_email: user.email || "customer@example.com",
        customer_phone: address.phoneNumber,
      },
      order_meta: {
        return_url: `${NEXT_PUBLIC_BASE_URL}/payment-callback?order_id=${orderId}`,
      },
    };

    // console.log("Initiating payment with payload:", JSON.stringify(payload));
    // console.log("Using Cashfree API URL:", CASHFREE_API_URL);

    // Initiate payment with Cashfree
    const paymentResponse = await axios.post(CASHFREE_API_URL, payload, {
      headers: {
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
    });

    // console.log("Payment response:", JSON.stringify(paymentResponse.data));

    if (!paymentResponse.data.payment_session_id) {
      throw new Error("Invalid payment response from Cashfree");
    }

    // Update the order with the payment session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: paymentResponse.data.payment_session_id,
        status: "PAYMENT_INITIATED",
      },
    });

    return NextResponse.json({
      sessionId: paymentResponse.data.payment_session_id,
      orderId: orderId,
      paymentLink: paymentResponse.data.payments.url,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);

    if (axios.isAxiosError(error)) {
      console.error("Cashfree API error:", error.response?.data);
      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            error:
              "Invalid Cashfree API credentials. Please check your API key and secret.",
          },
          { status: 401 },
        );
      }
      return NextResponse.json(
        { error: "Payment service error", details: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
