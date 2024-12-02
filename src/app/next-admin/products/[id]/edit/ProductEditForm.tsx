"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductImage = {
  id: string;
  url: string;
};

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  minPrice: number;
  sizes: string[];
  images: ProductImage[];
  categoryId: string;
  subcategoryId: string | null;
  isFeatured: boolean;
  isVisible: boolean;
};

export default function ProductEditForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState(product);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoryId) {
        const response = await fetch(
          `/api/categories/${formData.categoryId}/subcategories`,
        );
        const data = await response.json();
        setSubcategories(data);
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [formData.categoryId]);

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
    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subcategoryId: null }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], url: value };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { id: `new-${Date.now()}`, url: "" }],
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
        body: JSON.stringify({
          ...formData,
          images: formData.images.map((image) => ({ url: image.url })),
        }),
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
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <Select
          onValueChange={(value) => handleSelectChange("categoryId", value)}
          defaultValue={formData.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="subcategoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Subcategory
        </label>
        <Select
          onValueChange={(value) => handleSelectChange("subcategoryId", value)}
          defaultValue={formData.subcategoryId || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcat) => (
              <SelectItem key={subcat.id} value={subcat.id}>
                {subcat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isFeatured: checked }))
          }
        />
        <label
          htmlFor="isFeatured"
          className="text-sm font-medium text-gray-700"
        >
          Featured Product
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isVisible"
          checked={formData.isVisible}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isVisible: checked }))
          }
        />
        <label
          htmlFor="isVisible"
          className="text-sm font-medium text-gray-700"
        >
          Visible
        </label>
      </div>
      <Button type="submit">Update Product</Button>
    </form>
  );
}
