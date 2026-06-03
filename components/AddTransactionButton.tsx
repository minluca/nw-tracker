"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Modal button for adding a new transaction.
 * Fetches accounts and categories dynamically on mount.
 * On submit, posts to /api/transactions and refreshes the page.
 */
export default function AddTransactionButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [accountId, setAccountId] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();

  // Fetch accounts on mount to populate selects
  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((accounts) => {
        setAccounts(accounts);
        // Preselect first account as default
        if (accounts.length > 0) setAccountId(accounts[0].id);
      });
  }, []);

  // Fetch categories on mount to populate selects
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((categories) => {
        setCategories(categories);
        // Preselect first category as default
        if (categories.length > 0) setCategoryId(categories[0].id);
      });
  }, []);

  async function handleSubmit() {
    if (!payee || !amount) return;
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        categoryId,
        type,
        payee,
        amount: parseFloat(amount),
      }),
    });
    setPayee("");
    setAmount("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl py-6 text-base font-medium"
      >
        + Aggiungi transazione
      </Button>{" "}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuova transazione</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setType("expense")}
                className={`flex-1 py-2 rounded-lg border text-sm ${type === "expense" ? "bg-red-50 border-red-300 text-red-600" : "border-gray-200 text-gray-400"}`}
              >
                Uscita
              </button>
              <button
                onClick={() => setType("income")}
                className={`flex-1 py-2 rounded-lg border text-sm ${type === "income" ? "bg-green-50 border-green-300 text-green-600" : "border-gray-200 text-gray-400"}`}
              >
                Entrata
              </button>
            </div>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="A chi / per cosa"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
            <input
              type="number"
              placeholder="Importo"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Button onClick={handleSubmit}>Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
