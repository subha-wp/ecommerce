// @ts-nocheck
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type AddressFormData = {
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

type AddressFormProps = {
  userId: string;
  onAddAddress: (address: AddressFormData & { id: string }) => void;
  onCancel: () => void;
  initialData?: AddressFormData;
};

export default function AddressForm({
  userId,
  onAddAddress,
  onCancel,
  initialData,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: initialData,
  });
  const { toast } = useToast();

  const onSubmit = async (data: AddressFormData) => {
    try {
      const url = initialData
        ? `/api/user/${userId}/addresses/${initialData.id}`
        : `/api/user/${userId}/addresses`;
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save address");

      const savedAddress = await response.json();
      onAddAddress(savedAddress);
      toast({
        title: initialData ? "Address Updated" : "Address Added",
        description: `Your address has been successfully ${initialData ? "updated" : "added"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "add"} address. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <Input
          id="name"
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          {...register("phoneNumber", { required: "Phone number is required" })}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="addressLine1"
          className="block text-sm font-medium text-gray-700"
        >
          Address Line 1
        </label>
        <Input
          id="addressLine1"
          {...register("addressLine1", {
            required: "Address Line 1 is required",
          })}
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-sm text-red-600">
            {errors.addressLine1.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="addressLine2"
          className="block text-sm font-medium text-gray-700"
        >
          Address Line 2
        </label>
        <Input id="addressLine2" {...register("addressLine2")} />
      </div>
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <Input
          id="city"
          {...register("city", { required: "City is required" })}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          State
        </label>
        <Input
          id="state"
          {...register("state", { required: "State is required" })}
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="zipCode"
          className="block text-sm font-medium text-gray-700"
        >
          Postal Code
        </label>
        <Input
          id="zipCode"
          {...register("zipCode", { required: "Postal Code is required" })}
        />
        {errors.zipCode && (
          <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700"
        >
          Country
        </label>
        <Input
          id="country"
          {...register("country", { required: "Country is required" })}
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>
      <div>
        <label className="flex items-center">
          <input type="checkbox" {...register("isDefault")} className="mr-2" />
          <span className="text-sm font-medium text-gray-700">
            Set as default address
          </span>
        </label>
      </div>
      <div className="space-x-2">
        <Button type="submit">{initialData ? "Update" : "Add"} Address</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
