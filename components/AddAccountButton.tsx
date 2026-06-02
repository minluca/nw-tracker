"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function AddAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("bank");
  const [openingBalance, setOpeningBalance] = useState("");
  const [linkedForInvestments, setLinkedForInvestments] = useState(false);

  async function handleSubmit() {
    if (!name || !openingBalance) return;
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        openingBalance: parseFloat(openingBalance),
        isActive: true,
        linkedForInvestments,
      }),
    });

    setName("");
    setOpeningBalance("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        + Aggiungi conto
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuovo conto</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <input
              type="text"
              placeholder="Nome conto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="cash">Cash</option>
              <option value="bank">Banca</option>
              <option value="investment">Investimento</option>
              <option value="other">Altro</option>
            </select>
            <input
              type="number"
              placeholder="Saldo iniziale"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={linkedForInvestments}
                onChange={(e) => setLinkedForInvestments(e.target.checked)}
              />
              Conto per investimenti
            </label>
            <Button onClick={handleSubmit}>Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
