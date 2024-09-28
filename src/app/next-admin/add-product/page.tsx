"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    minPrice: "",
    sizes: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          minPrice: parseFloat(formData.minPrice),
          sizes: formData.sizes.split(",").map((size) => size.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const product = await response.json();
      toast({
        title: "Product Added",
        description: `${product.title} has been added successfully.`,
      });
      router.push("/next-admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="minPrice">Minimum Price</Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              step="0.01"
              value={formData.minPrice}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="sizes">Sizes (comma-separated)</Label>
          <Input
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleInputChange}
            placeholder="S, M, L, XL"
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
