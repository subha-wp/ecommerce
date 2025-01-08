"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topProducts = [
  {
    name: "Tata Salt",
    revenue: "₹45,231",
    image: "/products/tata-salt.jpg"
  },
  {
    name: "Aashirvaad Atta",
    revenue: "₹32,123",
    image: "/products/atta.jpg"
  },
  {
    name: "Fortune Oil",
    revenue: "₹28,389",
    image: "/products/oil.jpg"
  },
  {
    name: "Maggi Noodles",
    revenue: "₹25,456",
    image: "/products/maggi.jpg"
  },
  {
    name: "Parle-G Biscuits",
    revenue: "₹23,789",
    image: "/products/parle-g.jpg"
  }
];

export function TopProducts() {
  return (
    <div className="space-y-8">
      {topProducts.map((product) => (
        <div key={product.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={product.image} alt={product.name} />
            <AvatarFallback>{product.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">Top Seller</p>
          </div>
          <div className="ml-auto font-medium">{product.revenue}</div>
        </div>
      ))}
    </div>
  );
}