import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
  };
};

type OrderCardProps = {
  order: {
    id: string;
    createdAt: string;
    status: string;
    items: OrderItem[];
  };
  onClick: () => void;
};

export function OrderCard({ order, onClick }: OrderCardProps) {
  const total =
    order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="text-sm uppercase text-muted-foreground">
              Order #{order.id}
            </CardTitle>
            <CardDescription>{formatDate(order.createdAt)}</CardDescription>
          </div>
          <Badge
            variant={order.status === "DELIVERED" ? "default" : "secondary"}
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{order.items?.length ?? 0} items</span>
          </div>
          <p className="font-semibold">₹{total.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
