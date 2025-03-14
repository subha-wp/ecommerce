//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProductImageGallery from "./ProductImageGallery";
import { Badge } from "@/components/ui/badge";
import ProductReviews from "@/components/ProductReviews";
import { StarRating } from "@/components/StarRating";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  images: any;
};

type Rating = {
  averageRating: number;
  totalReviews: number;
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
  const [rating, setRating] = useState<Rating>({
    averageRating: 0,
    totalReviews: 0,
  });

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

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/rating`);
        if (response.ok) {
          const data = await response.json();
          setRating(data);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchRating();
  }, [product.id]);

  return (
    <div className="relative z-0 md:flex md:gap-8 md:pb-0">
      <div className="md:w-1/2">
        <ProductImageGallery
          images={product.images}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />
      </div>
      <div className="md:w-1/2">
        <div className="flex flex-col gap-4 md:mt-0">
          <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
          <div className="mb-4">
            <StarRating
              rating={rating.averageRating}
              totalReviews={rating.totalReviews}
              size="lg"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl font-semibold md:text-2xl">
              ₹{product.minPrice.toFixed(2)}
            </p>
            <p className="font-semibold text-gray-400 line-through">
              ₹{product.price.toFixed(2)}
            </p>
            <Badge className="text-sm font-semibold">
              {discountPercentage}% off
            </Badge>
          </div>
        </div>

        <div className="mb-4 mt-6 flex items-center justify-between md:mt-8">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium md:text-base"
          >
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

        <div className="mt-4 flex space-x-4 md:mt-6">
          <Button onClick={handleAddToCart} className="flex-1 md:text-lg">
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            variant="secondary"
            className="flex-1 md:text-lg"
          >
            Buy Now
          </Button>
        </div>

        <div className="py-4 md:mt-8">
          <p className="mb-2 text-lg font-bold md:text-xl">Description</p>
          <p className="text-sm text-gray-600 sm:text-base md:text-lg">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
