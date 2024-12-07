import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="min-w-[170px] max-w-[250px] rounded-lg border border-primary p-1">
      <div className="relative">
        <Skeleton className="mb-4 h-48 w-full rounded" />
        <Skeleton className="absolute right-0 top-0 h-5 w-20 rounded-bl rounded-tr" />
      </div>
      <Skeleton className="mb-2 h-4 w-3/4" />
      <div className="my-1 flex items-center justify-between rounded-md border border-primary p-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
