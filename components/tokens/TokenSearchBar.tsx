"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import debounce from "lodash/debounce";

interface TokenSearchBarProps {
  onSearch?: (query: string) => void;
}

export function TokenSearchBar({ onSearch }: TokenSearchBarProps) {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch?.(value);
    }, 300),
    [onSearch]
  );

  return (
    <div className="relative flex items-center justify-between w-full p-4  border-white/[0.05] rounded-lg">
      <div className="text-lg font-semibold text-blue-300">Available Pools</div>
      <div className="relative w-1/2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground/70 transform -translate-y-1/2" />
        <Input
          placeholder="Search by token name or symbol..."
          className="w-full pl-10 bg-background/50 border-white/[0.05] focus:border-accent/30 transition-colors 
        placeholder:text-muted-foreground/50 hover:border-white/[0.08]"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
