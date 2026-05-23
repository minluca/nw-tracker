"use client";

import { useState } from "react";

export default function ExpenseForm({
  onExpenseAdded,
}: {
  onExpenseAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit() {
    if (!name || !amount) return;

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount: parseFloat(amount) }),
    });

    setName("");
    setAmount("");
    onExpenseAdded();
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nome spesa"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSubmit}>Aggiungi</button>
    </div>
  );
}
