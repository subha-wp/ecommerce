import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createXmlElement } from "@/lib/xml";

// Function to map your product categories to Google product categories
function getGoogleProductCategory(
  category: string,
  subcategory: string,
): string {
  const fullCategory =
    `${category}${subcategory ? ` > ${subcategory}` : ""}`.toLowerCase();

  if (fullCategory.includes("masala-oil-more")) {
    return "422"; // Food, Beverages & Tobacco > Food Items
  } else if (fullCategory.includes("snacks-and-munchies")) {
    return "431"; // Food, Beverages & Tobacco > Food Items > Snack Foods
  } else if (fullCategory.includes("breakfast-and-instant-food")) {
    return "5749"; // Food, Beverages & Tobacco > Food Items > Grains & Rice
  } else if (fullCategory.includes("atta-rice-dal")) {
    return "5749"; // Food, Beverages & Tobacco > Food Items > Grains & Rice
  } else if (fullCategory.includes("tea-coffee-and-health-drink")) {
    return "2425"; // Food, Beverages & Tobacco > Beverages
  } else if (fullCategory.includes("bakery-and-biscuit")) {
    return "428"; // Food, Beverages & Tobacco > Food Items > Bakery
  } else if (fullCategory.includes("personal-care")) {
    return "477"; // Health & Beauty
  } else if (fullCategory.includes("home-and-office")) {
    return "536"; // Home & Garden
  } else if (fullCategory.includes("cleaning-essentials")) {
    return "4779"; // Home & Garden > Household Supplies
  } else if (fullCategory.includes("baby-care")) {
    return "5394"; // Baby & Toddler
  } else if (fullCategory.includes("sauces-and-spreads")) {
    return "6202"; // Food, Beverages & Tobacco > Food Items > Condiments & Sauces
  }

  // Default category if no match is found
  return "422"; // Food, Beverages & Tobacco > Food Items
}

export async function GET() {
  try {
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

    // Create XML items with proper escaping
    const items = products
      .map((product) => {
        const productData = {
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
          "g:brand": "JSR TRADERS",
          "g:condition": "new",
          "g:product_type": `${product.category.name}${product.subcategory ? ` > ${product.subcategory.name}` : ""}`,
          "g:google_product_category": getGoogleProductCategory(
            product.category.name,
            product.subcategory?.name || "",
          ),
          "g:identifier_exists": "no",
        };

        const productElements = Object.entries(productData)
          .map(([key, value]) => createXmlElement(key, value.toString()))
          .join("\n        ");

        return `    <item>\n        ${productElements}\n    </item>`;
      })
      .join("\n");

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>JSR TRADERS Product Feed</title>
    <link>${process.env.NEXT_PUBLIC_BASE_URL}</link>
    <description>Product feed for Google Merchant Center</description>
${items}
  </channel>
</rss>`;

    return new NextResponse(xmlContent, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
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
