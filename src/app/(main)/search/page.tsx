/* eslint-disable react/no-unescaped-entities */
import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;

  return (
    <div className="container mx-auto max-w-7xl px-2 py-8">
      <h1 className="mb-4 text-xl font-bold">Search Results for "{query}"</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
