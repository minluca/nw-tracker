"use client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type AccountItem = {
  id: string;
  name: string;
  type: string;
  openingBalance: unknown;
  openingDate: Date;
  currency: string;
  isActive: boolean;
  linkedForInvestments: boolean;
};

export default function AccountList({ accounts }: { accounts: AccountItem[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch("/api/accounts/" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500 uppercase tracking-wide">
          Lista di Conti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <button
              onClick={() => handleDelete(account.id)}
              className="text-red-400 text-xs"
            >
              Elimina
            </button>
            <div className="flex flex-col">
              <span className="font-medium">{account.name}</span>
              <span className="text-xs text-gray-400">
                {account.type} · € {String(account.openingBalance)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
