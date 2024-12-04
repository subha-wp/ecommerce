"use client";

import { formatDate } from "@/lib/utils";

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

type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  address: {
    name: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: string;
  totalAmount: number;
};

export function generateInvoiceContent(
  order: Order,
  type: "invoice" | "challan",
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${type === "invoice" ? "Invoice" : "Delivery Challan"} - ${
        order.id
      }</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .document-type {
          font-size: 20px;
          margin-bottom: 20px;
        }
        .info-section {
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
        }
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">JSR TRADERS</div>
        <div class="document-type">${
          type === "invoice" ? "Tax Invoice" : "Delivery Challan"
        }</div>
      </div>

      <div class="info-grid">
        <div class="info-section">
          <h3>Bill To:</h3>
          <p>${order.address.name}</p>
          <p>${order.address.addressLine1}</p>
          ${order.address.addressLine2 ? `<p>${order.address.addressLine2}</p>` : ""}
          <p>${order.address.city}, ${order.address.state} ${order.address.zipCode}</p>
          <p>Phone: ${order.address.phoneNumber}</p>
        </div>
        
        <div class="info-section">
          <h3>Order Details:</h3>
          <p>Order ID: ${order.id}</p>
          <p>Date: ${formatDate(order.createdAt)}</p>
          <p>Status: ${order.status}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.product.title}</td>
              <td>${item.product.description.substring(0, 100)}...</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toFixed(2)}</td>
              <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="total-section">
        <h3>Total Amount: ₹${total.toFixed(2)}</h3>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>JSR TRADERS - West Bengal, INDIA - 743351</p>
        <p>Email: connect@jsrtraders.co.in</p>
      </div>

      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
        Print ${type === "invoice" ? "Invoice" : "Challan"}
      </button>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}
