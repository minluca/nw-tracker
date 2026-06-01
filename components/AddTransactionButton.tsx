"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: replace with dynamic account selection
const TEMP_ACCOUNT_ID = "a8b6e5dd-b514-41ad-8a25-cfac354240d6";

export default function AddTransactionButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    if (!payee || !amount) return;

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: TEMP_ACCOUNT_ID,
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
      <Button onClick={() => setOpen(true)} className="w-full">
        + Aggiungi transazione
      </Button>
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
