import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-16 text-center">
      <div>
        <h1 className="mb-6 text-4xl font-bold">Thank You for Your Order!</h1>
        <p className="mb-8 text-xl">
          Your order (ID: {params.id}) has been successfully placed.
        </p>
        <div className="mb-12">
          <p className="mb-2 text-lg">
            We appreciate your business and hope you enjoy your purchase.
          </p>
          {/* <p className="text-lg">
            You will receive an email confirmation shortly.
          </p> */}
        </div>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
