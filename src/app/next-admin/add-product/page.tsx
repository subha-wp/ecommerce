"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Smartphones", "Refrigerator", "AC", "Accessories"],
  },
  { name: "Clothing", subcategories: ["Men", "Women", "Kids"] },
  { name: "Home", subcategories: ["Furniture", "Decor", "Kitchen"] },
];

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    minPrice: "",
    sizes: "",
    image: "",
    category: "",
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      toast({
        title: "Product added",
        description: "The product has been successfully added.",
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
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Price
          </label>
          <Input
            type="number"
            id="minPrice"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label
            htmlFor="sizes"
            className="block text-sm font-medium text-gray-700"
          >
            Sizes (comma-separated)
          </label>
          <Input
            type="text"
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <Input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {formData.category && (
          <div>
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-700"
            >
              Subcategory
            </label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("subcategory", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .find((cat) => cat.name === formData.category)
                  ?.subcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
