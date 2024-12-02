//@ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type Subcategory = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
};

type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export default function SubcategoriesManager({
  category,
}: {
  category: Category;
}) {
  const [subcategories, setSubcategories] = useState(category.subcategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const { toast } = useToast();

  const handleAdd = async () => {
    try {
      const response = await fetch(
        `/api/categories/${category.id}/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add subcategory");
      }

      const newSubcategory = await response.json();
      setSubcategories([...subcategories, newSubcategory]);
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", image: "" });

      toast({
        title: "Success",
        description: "Subcategory added successfully",
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to add subcategory",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedSubcategory) return;

    try {
      const response = await fetch(
        `/api/categories/${category.id}/subcategories/${selectedSubcategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }

      const updatedSubcategory = await response.json();
      setSubcategories(
        subcategories.map((sub) =>
          sub.id === selectedSubcategory.id ? updatedSubcategory : sub,
        ),
      );
      setIsEditDialogOpen(false);
      setSelectedSubcategory(null);
      setFormData({ name: "", description: "", image: "" });

      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (subcategoryId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      const response = await fetch(
        `/api/categories/${category.id}/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete subcategory");
      }

      setSubcategories(subcategories.filter((sub) => sub.id !== subcategoryId));

      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Subcategory</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add New Subcategory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAdd}>Add Subcategory</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>
                {subcategory.image && (
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                )}
              </TableCell>
              <TableCell>{subcategory.name}</TableCell>
              <TableCell>{subcategory.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSubcategory(subcategory);
                      setFormData({
                        name: subcategory.name,
                        description: subcategory.description || "",
                        image: subcategory.image || "",
                      });
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(subcategory.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
            <Button onClick={handleEdit}>Update Subcategory</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
