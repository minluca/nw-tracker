import AddCategoryButton from "@/components/AddCategoryButton";
import CategoryList from "@/components/CategoryList";
import getAuthenticatedUser from "@/lib/auth";
import { getUserCategories } from "@/lib/db/categories";

export default async function Settings() {
  // --- Authentication ---
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // --- Data fetching ---
  const categories = await getUserCategories(user.id);

  return (
    <main className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Account</h1>
      <CategoryList categories={categories}></CategoryList>
      <AddCategoryButton></AddCategoryButton>
    </main>
  );
}
