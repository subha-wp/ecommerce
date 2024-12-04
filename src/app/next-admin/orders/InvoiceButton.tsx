import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type InvoiceButtonProps = {
  order: any;
  type: "invoice" | "challan";
  onGenerate: () => void;
};

export default function InvoiceButton({
  order,
  type,
  onGenerate,
}: InvoiceButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={onGenerate}
    >
      <FileText className="h-4 w-4" />
      {type === "invoice" ? "Generate Invoice" : "Generate Challan"}
    </Button>
  );
}
