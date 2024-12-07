/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { debounce } from "lodash";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductSearch({
  searchQuery,
  onSearchChange,
}: ProductSearchProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce the search change
  const debouncedSearchChange = useCallback(
    debounce((query: string) => {
      onSearchChange(query);
    }, 3000),
    [onSearchChange],
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalSearchQuery(newQuery);
    debouncedSearchChange(newQuery);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        value={localSearchQuery}
        onChange={handleSearchInputChange}
        className="pl-8"
      />
    </div>
  );
}
