import getAuthenticatedUser from "@/lib/auth";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Profile() {
  const user = await getAuthenticatedUser();
  const clerkUser = await currentUser();
  if (!user) return null;

  const displayName = clerkUser?.firstName ?? user.email.split("@")[0];
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <main className="p-4 pt-6 flex flex-col gap-4">
      <h1>Profilo</h1>
      <Card>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="value-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <SignOutButton>
              <Button variant="destructive" className="w-full">
                Esci dall&apos;account
              </Button>
            </SignOutButton>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
