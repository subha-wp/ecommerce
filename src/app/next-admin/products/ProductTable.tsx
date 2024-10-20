"use client";

import { useState } from "react";
import Link from "next/link";
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
import Image from "next/image";

type Product = {
  image: string;
  id: string;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  minPrice: number;
  description: string;
};

export default function ProductTable({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((product) => product.id !== id));
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description:
            "There was an error deleting the product. Please try again.",
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
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Subcategory</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Min Price</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Image
                src={product.image}
                alt={product.title}
                width={30}
                height={30}
                className="h-10 w-10 rounded object-contain"
              />
            </TableCell>
            <TableCell>{product.title.substring(0, 50)}...</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.subcategory}</TableCell>
            <TableCell>₹{product.price.toFixed(2)}</TableCell>
            <TableCell>₹{product.minPrice.toFixed(2)}</TableCell>
            <TableCell>{product.description.substring(0, 50)}...</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/next-admin/products/${product.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
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
