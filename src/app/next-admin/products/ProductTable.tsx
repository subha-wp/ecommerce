"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import ProductSearch from "./ProductSearch";

type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  title: string;
  description: string;
  minPrice: number;
  sizes: string[];
  categoryId: string;
  subcategoryId: string | null;
  images: { url: string }[];
  isFeatured: boolean;
  isVisible: boolean;
  category: { name: string };
  subcategory: { name: string } | null;
};

type ProductTableProps = {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
  onSearch: (query: string) => void;
};

export default function ProductTable({
  products: initialProducts,
  currentPage,
  pageSize,
  totalProducts,
  onPageChange,
  onPageSizeChange,
  onSearch,
}: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
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
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggle = async (
    id: string,
    field: "isFeatured" | "isVisible",
    value: boolean,
  ) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product ${field}`);
      }

      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, [field]: value } : product,
        ),
      );

      toast({
        title: "Product updated",
        description: `Product has been ${field === "isFeatured" ? (value ? "featured" : "unfeatured") : value ? "made visible" : "hidden"}.`,
      });
    } catch (error) {
      console.error(`Error updating product ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update product ${field}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearch(query);
    },
    [onSearch],
  );

  return (
    <div>
      <div className="mb-4 space-y-4">
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Items per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={onPageSizeChange}
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
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts}{" "}
            products
          </div>
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
            <TableHead>Featured</TableHead>
            <TableHead>Visible</TableHead>
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
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{product.subcategory?.name || "N/A"}</TableCell>
              <TableCell>₹{product.price.toFixed(2)}</TableCell>
              <TableCell>₹{product.minPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Switch
                  checked={product.isFeatured}
                  onCheckedChange={(checked) =>
                    handleToggle(product.id, "isFeatured", checked)
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={product.isVisible}
                  onCheckedChange={(checked) =>
                    handleToggle(product.id, "isVisible", checked)
                  }
                />
              </TableCell>
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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
