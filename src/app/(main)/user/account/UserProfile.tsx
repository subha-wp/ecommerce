"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type UserData = {
  displayName: string;
  email: string;
  phoneNumber?: string;
};

type UserProfileProps = {
  user: UserData;
};

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: user,
  });
  const { toast } = useToast();

  const onSubmit = async (data: UserData) => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 md:p-6">
      <h2 className="mb-4 text-xl font-semibold md:text-2xl">
        Profile Information
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            id="displayName"
            {...register("displayName", {
              required: "Display Name is required",
            })}
            disabled={!isEditing}
            className="mt-1"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.displayName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            disabled={!isEditing}
            className="mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </form>
    </div>
  );
}
