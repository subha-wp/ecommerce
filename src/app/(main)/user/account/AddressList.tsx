/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AddressForm from "./AddressForm";

type Address = {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

type AddressListProps = {
  userId: string;
};

export function AddressList({ userId }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/addresses`);
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = (newAddress: Address) => {
    setAddresses([...addresses, newAddress]);
    setIsAddingNew(false);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/addresses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete address");
      setAddresses(addresses.filter((address) => address.id !== id));
      toast({
        title: "Address Deleted",
        description: "The address has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-2xl font-semibold">My Addresses</h2>
      {addresses.map((address) => (
        <div key={address.id} className="mb-4 rounded border p-4">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
          <p>{address.country}</p>
          {address.isDefault && (
            <p className="font-semibold text-green-600">Default Address</p>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteAddress(address.id)}
            className="mt-2"
          >
            Delete
          </Button>
        </div>
      ))}
      {isAddingNew ? (
        <AddressForm
          userId={userId}
          onAddAddress={handleAddAddress}
          onCancel={() => setIsAddingNew(false)}
        />
      ) : (
        <Button onClick={() => setIsAddingNew(true)}>Add New Address</Button>
      )}
    </div>
  );
}
