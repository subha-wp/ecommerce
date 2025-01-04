import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all visible products with their categories
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
      },
      include: {
        images: true,
        category: {
          select: { name: true },
        },
        subcategory: {
          select: { name: true },
        },
      },
    });

    // Transform products into Google Merchant format
    const merchantProducts = products.map((product) => ({
      "g:id": product.id,
      "g:title": product.title,
      "g:description": product.description,
      "g:link": `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`,
      "g:image_link": product.images[0]?.url || "",
      "g:additional_image_link": product.images
        .slice(1)
        .map((img) => img.url)
        .join(","),
      "g:availability": "in_stock",
      "g:price": `${product.minPrice} INR`,
      "g:brand": "Generic",
      "g:condition": "new",
      "g:product_type": `${product.category.name}${product.subcategory ? ` > ${product.subcategory.name}` : ""}`,
      "g:google_product_category": "2271", // General Merchandise
      "g:identifier_exists": "no",
    }));

    // Create XML feed
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>JSR TRADERS Product Feed</title>
    <link>${process.env.NEXT_PUBLIC_BASE_URL}</link>
    <description>Product feed for Google Merchant Center</description>
    ${merchantProducts
      .map(
        (product) => `
    <item>
      ${Object.entries(product)
        .map(
          ([key, value]) => `
      <${key}>${value}</${key}>`,
        )
        .join("")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(xmlContent, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating merchant feed:", error);
    return NextResponse.json(
      { error: "Failed to generate merchant feed" },
      { status: 500 },
    );
  }
}
