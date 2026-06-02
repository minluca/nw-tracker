import getAuthenticatedUser from "@/lib/auth";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Profile() {
  // --- Authentication ---
  const user = await getAuthenticatedUser();
  const clerkUser = await currentUser();
  if (!user) return null;

  return (
    <main className="p-4 flex flex-col gap-4">
      <div>{clerkUser?.firstName ?? user.email.split("@")[0]}</div>
      <div>{user.email}</div>
      <div>
        <SignOutButton></SignOutButton>
      </div>
    </main>
  );
}
