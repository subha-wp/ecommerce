"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
};

export default function CategoryTable({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        setCategories(categories.filter((category) => category.id !== id));
        toast({
          title: "Category deleted",
          description: "The category has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Subcategories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={50}
                  height={50}
                  className="rounded object-cover"
                />
              )}
            </TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>
              {category.subcategories.map((sub) => sub.name).join(", ")}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/next-admin/categories/${category.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Link
                  href={`/next-admin/categories/${category.id}/subcategories`}
                >
                  <Button variant="outline" size="sm">
                    Manage Subcategories
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
