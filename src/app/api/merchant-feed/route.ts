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

  // Masala, Oil & More
  if (fullCategory.includes("dry fruits")) return "431"; // Snack Foods
  if (fullCategory.includes("oil")) return "5751"; // Cooking & Baking Ingredients > Cooking Oils
  if (fullCategory.includes("salt sugar jaggery")) return "5748"; // Sweeteners
  if (fullCategory.includes("papad & fryums")) return "431"; // Snack Foods
  if (
    fullCategory.includes("powder spices") ||
    fullCategory.includes("whole spices")
  )
    return "5752"; // Herbs & Spices
  if (fullCategory.includes("ghee & vanaspati")) return "5751"; // Cooking & Baking Ingredients > Cooking Oils

  // Snacks & Munchies
  if (
    fullCategory.includes("chips-and-crisps") ||
    fullCategory.includes("nachos")
  )
    return "7132"; // Snack Foods > Chips & Crisps
  if (fullCategory.includes("rusks-and-wafers")) return "428"; // Bakery
  if (
    fullCategory.includes("bhujis-and-mixtures") ||
    fullCategory.includes("snacks")
  )
    return "431"; // Snack Foods

  // Breakfast & Instant Food
  if (fullCategory.includes("noodles") || fullCategory.includes("pasta"))
    return "5825"; // Pasta & Noodles
  if (fullCategory.includes("soup")) return "6198"; // Soups & Broths
  if (fullCategory.includes("ready-to-cook")) return "5737"; // Prepared Foods

  // Atta, Rice & Dal
  if (
    fullCategory.includes("atta") ||
    fullCategory.includes("besan-sooji-maida")
  )
    return "5826"; // Flours & Meals
  if (fullCategory.includes("rice")) return "5749"; // Grains & Rice
  if (fullCategory.includes("dal")) return "5827"; // Beans & Legumes

  // Tea, Coffee & Health Drink
  if (fullCategory.includes("tea")) return "2425"; // Beverages > Tea & Infusions
  if (fullCategory.includes("coffee")) return "2427"; // Beverages > Coffee
  if (
    fullCategory.includes("milk-drinks") ||
    fullCategory.includes("energy drinks")
  )
    return "5724"; // Beverages > Soft Drinks

  // Bakery & Biscuit
  if (
    fullCategory.includes("rusks & wafers") ||
    fullCategory.includes("glucose & marie") ||
    fullCategory.includes("cream biscuit") ||
    fullCategory.includes("cookies")
  )
    return "428"; // Bakery
  if (fullCategory.includes("healthy & digestive")) return "5726"; // Beverages > Sports & Energy Drinks
  if (fullCategory.includes("bread") || fullCategory.includes("cakes"))
    return "428"; // Bakery

  // Personal Care
  if (fullCategory.includes("makeup")) return "2915"; // Makeup
  if (fullCategory.includes("face wash") || fullCategory.includes("face care"))
    return "2914"; // Skin Care
  if (fullCategory.includes("shampoo & conditioner")) return "2921"; // Hair Care
  if (fullCategory.includes("handwash")) return "2946"; // Bath & Body
  if (fullCategory.includes("oral care")) return "2948"; // Oral Care
  if (fullCategory.includes("feminine care")) return "2950"; // Feminine Care
  if (fullCategory.includes("hair oil serum")) return "2921"; // Hair Care
  if (fullCategory.includes("bathing soaps")) return "2946"; // Bath & Body

  // Cleaning Essentials
  if (
    fullCategory.includes("liquid detergents") ||
    fullCategory.includes("detergent powder & bars")
  )
    return "4510"; // Laundry Supplies
  if (fullCategory.includes("dishwashing")) return "4516"; // Dishwashing Supplies
  if (fullCategory.includes("disinfectants")) return "4496"; // Household Cleaning Products
  if (fullCategory.includes("cleaning tools")) return "499873"; // Household Cleaning Tools
  if (fullCategory.includes("toilet bathroom cleaners")) return "4496"; // Household Cleaning Products
  if (fullCategory.includes("floor & surface cleaners")) return "4496"; // Household Cleaning Products
  if (fullCategory.includes("fabric conditioner & additives")) return "4510"; // Laundry Supplies
  if (fullCategory.includes("freshner")) return "4442"; // Air Fresheners

  // Baby Care
  if (fullCategory.includes("skin & hair care")) return "5397"; // Baby Bath & Body Care
  if (fullCategory.includes("baby food")) return "5394"; // Baby Foods
  if (fullCategory.includes("baby wipes")) return "5397"; // Baby Bath & Body Care
  if (fullCategory.includes("bathing needs")) return "5397"; // Baby Bath & Body Care
  if (fullCategory.includes("diapers & more")) return "5399"; // Diapering

  // Sauces & Spreads
  if (
    fullCategory.includes("tomato & chilli ketchup") ||
    fullCategory.includes("mayonnaise") ||
    fullCategory.includes("cooking sauces & vinegar") ||
    fullCategory.includes("asian sauces")
  )
    return "6202"; // Condiments & Sauces
  if (fullCategory.includes("honey & chyawanprash")) return "5748"; // Sweeteners
  if (fullCategory.includes("chocolate")) return "434"; // Candy & Chocolate
  if (fullCategory.includes("jaggery")) return "5748"; // Sweeteners

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
          "g:price": `${product.price} INR`,
          "g:sale_price": `${product.minPrice} INR`,
          "g:brand": "Zaptray",
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
    <title>Zaptray Product Feed</title>
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
