import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Subcategory = {
  name: string;
  image: string;
};

type Category = {
  name: string;
  subcategories: Subcategory[];
};

export default function SubcategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  const allSubcategories = categories.flatMap(
    (category) => category.subcategories,
  );

  return (
    <ScrollArea className="mb-2 w-full whitespace-nowrap bg-slate-100">
      <div className="flex justify-center space-x-4 p-4">
        {allSubcategories.map((subcategory) => (
          <Link
            key={subcategory.name}
            href={`/products?subcategory=${encodeURIComponent(subcategory.name)}`}
            className="flex flex-col items-center space-y-2"
          >
            <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
              <Image
                src={subcategory.image}
                alt={subcategory.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-center text-xs">{subcategory.name}</span>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
