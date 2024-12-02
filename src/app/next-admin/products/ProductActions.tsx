//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ProductActions({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/next-admin/products/${productId}/edit`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
