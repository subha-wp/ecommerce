// @ts-nocheck
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProductImageGallery from "./ProductImageGallery";
import { Badge } from "@/components/ui/badge";
import ProductReviews from "@/components/ProductReviews";
type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  images: any;
};

export default function ProductDetails({
  product,
  initialIsFavorite,
}: {
  product: Product;
  initialIsFavorite: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, size: selectedSize });
    toast({
      title: "Added to Cart",
      description: `${quantity} item(s) have been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity, size: selectedSize });
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.price - product.minPrice) / product.price) * 100,
  );

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite
          ? "The product has been removed from your favorites."
          : "The product has been added to your favorites.",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description:
          "There was an error updating your favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // Implement share functionality
    toast({
      title: "Share",
      description: "Sharing functionality to be implemented.",
    });
  };

  return (
    <div className="relative z-0 md:pb-0">
      <ProductImageGallery
        images={product.images}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShare}
      />
      <div className="mb-4 mt-6 flex items-center justify-between">
        <label htmlFor="quantity" className="block text-sm font-medium">
          Quantity:
        </label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-sm font-bold">{product.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-gray-400 line-through">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-xl font-semibold">
            ₹{product.minPrice.toFixed(2)}
          </p>
          <Badge className="text-sm font-semibold">
            {discountPercentage}% off
          </Badge>
        </div>
      </div>

      <div className="mt-2 flex space-x-4">
        <Button onClick={handleAddToCart} className="flex-1">
          Add to Cart
        </Button>
        <Button onClick={handleBuyNow} variant="secondary" className="flex-1">
          Buy Now
        </Button>
      </div>
      <div className="py-4">
        <p className="mb-2 font-bold">Description</p>
        <p className="text-sm text-gray-600 sm:text-base">
          {product.description}
        </p>
      </div>
    </div>
  );
}
