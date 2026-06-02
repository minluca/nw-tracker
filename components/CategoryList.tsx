"use client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type CategoryItem = {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
  isActive: boolean;
};

export default function CategoryList({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch("/api/categories/" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500 uppercase tracking-wide">
          Lista di Categorie
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-400 text-xs"
            >
              Elimina
            </button>
            <div className="flex flex-col">
              <span className="font-medium">{category.name}</span>
              <span className="text-xs text-gray-400">{category.type}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
