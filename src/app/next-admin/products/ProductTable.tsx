"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  title: string;
  description: string;
  minPrice: number;
  sizes: string[];
  category: string;
  subcategory: string | null;
  images: { url: string }[];
};

type ProductTableProps = {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalProducts: number;
};

export default function ProductTable({
  products: initialProducts,
  currentPage,
  pageSize,
  totalProducts,
}: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const { toast } = useToast();
  const router = useRouter();

  const totalPages = Math.ceil(totalProducts / pageSize);

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

  const handlePageChange = (newPage: number) => {
    router.push(`/next-admin/products?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    router.push(`/next-admin/products?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="mr-2">Items per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts}{" "}
          products
        </div>
      </div>
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
                  src={product.images[0]?.url || "/placeholder.png"}
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
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
