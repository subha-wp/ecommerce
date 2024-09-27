import { Loader2 } from "lucide-react";

export function ThinkingAnimation() {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Thinking...</span>
    </div>
  );
}
