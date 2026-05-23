"use client";

import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  async function fetchExpenses() {
    const response = await fetch("/api/expenses");
    const data = await response.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function handleDelete(id: number) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  }

  return (
    <main>
      <h1>Expense Tracker</h1>
      <ExpenseForm onExpenseAdded={fetchExpenses} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </main>
  );
}
