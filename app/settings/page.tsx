import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Impostazioni</h1>
      <Card>
        <CardContent className="p-0">
          <Link
            href="/settings/accounts"
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">
              <i className="ti ti-building-bank text-xl" />
              <span>Account</span>
            </div>
            <i className="ti ti-chevron-right text-gray-400" />
          </Link>
          <Link
            href="/settings/categories"
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">
              <i className="ti ti-tag text-xl" />
              <span>Categorie</span>
            </div>
            <i className="ti ti-chevron-right text-gray-400" />
          </Link>
          <Link
            href="/settings/profile"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <i className="ti ti-user text-xl" />
              <span>Profilo</span>
            </div>
            <i className="ti ti-chevron-right text-gray-400" />
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
