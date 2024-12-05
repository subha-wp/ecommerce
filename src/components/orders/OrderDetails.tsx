import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
  };
};

type OrderDetailsProps = {
  order: {
    id: string;
    createdAt: string;
    status: string;
    items: OrderItem[];
  } | null;
  open: boolean;
  onClose: () => void;
};

export function OrderDetails({ order, open, onClose }: OrderDetailsProps) {
  if (!order) return null;

  const total =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order Details</DialogTitle>
            <Badge
              variant={order.status === "DELIVERED" ? "default" : "secondary"}
            >
              {order.status}
            </Badge>
          </div>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Order #{order.id.slice(-6)}</p>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.title}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total Amount
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
