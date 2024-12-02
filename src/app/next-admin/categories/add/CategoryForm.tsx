"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

type Subcategory = {
  name: string;
  description: string;
  image: string;
};

type Category = {
  id?: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
};

export default function CategoryForm({ category }: { category?: Category }) {
  const [formData, setFormData] = useState<Category>(
    category || {
      name: "",
      description: "",
      image: "",
      subcategories: [],
    },
  );
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = category
        ? `/api/categories/${category.id}`
        : "/api/categories";
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      const savedCategory = await response.json();

      // Create subcategories
      if (formData.subcategories.length > 0) {
        await Promise.all(
          formData.subcategories.map((subcategory) =>
            fetch(`/api/categories/${savedCategory.id}/subcategories`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(subcategory),
            }),
          ),
        );
      }

      toast({
        title: category ? "Category updated" : "Category created",
        description: category
          ? "The category has been successfully updated."
          : "The category has been successfully created.",
      });
      router.push("/next-admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description:
          "There was an error saving the category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubcategoryChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const newSubcategories = [...prev.subcategories];
      newSubcategories[index] = {
        ...newSubcategories[index],
        [field]: value,
      };
      return { ...prev, subcategories: newSubcategories };
    });
  };

  const addSubcategory = () => {
    setFormData((prev) => ({
      ...prev,
      subcategories: [
        ...prev.subcategories,
        { name: "", description: "", image: "" },
      ],
    }));
  };

  const removeSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Category Details</h2>
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subcategories</h2>
          <Button type="button" onClick={addSubcategory} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        {formData.subcategories.map((subcategory, index) => (
          <div key={index} className="relative space-y-4 rounded-lg border p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeSubcategory(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div>
              <Label>Subcategory Name</Label>
              <Input
                value={subcategory.name}
                onChange={(e) =>
                  handleSubcategoryChange(index, "name", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={subcategory.description}
                onChange={(e) =>
                  handleSubcategoryChange(index, "description", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                type="url"
                value={subcategory.image}
                onChange={(e) =>
                  handleSubcategoryChange(index, "image", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
