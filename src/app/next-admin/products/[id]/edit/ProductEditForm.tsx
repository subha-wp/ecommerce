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
import { categories } from "../../../../../../categories";

type ProductImage = {
  id: string;
  url: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  images: ProductImage[];
  category: string;
  subcategory: string | null;
};

export default function ProductEditForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState(product);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sizes = e.target.value.split(",").map((size) => size.trim());
    setFormData((prev) => ({ ...prev, sizes }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], url: value };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { id: Date.now().toString(), url: "" }],
    }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      router.push("/next-admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          "There was an error updating the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
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
          value={formData.sizes.join(", ")}
          onChange={handleSizesChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URLs
        </label>
        {formData.images.map((image, index) => (
          <div key={image.id} className="mt-2 flex items-center space-x-2">
            <Input
              type="url"
              value={image.url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Enter image URL"
              required
            />
            <Button
              type="button"
              onClick={() => removeImageField(index)}
              variant="destructive"
              className="shrink-0"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addImageField} className="mt-2">
          Add Image URL
        </Button>
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
          defaultValue={formData.category}
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
      <div>
        <label
          htmlFor="subcategory"
          className="block text-sm font-medium text-gray-700"
        >
          Subcategory
        </label>
        <Select
          onValueChange={(value) => handleSelectChange("subcategory", value)}
          defaultValue={formData.subcategory || undefined}
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
      <Button type="submit">Update Product</Button>
    </form>
  );
}
