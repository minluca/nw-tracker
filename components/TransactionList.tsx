import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type TransactionItem = {
  id: string;
  date: Date;
  payee: string;
  amount: unknown;
  currency: string;
  type: string;
  category: { name: string; icon: string | null; color: string | null } | null;
};

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">
          Ultime transazioni
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <div className="flex flex-col">
              <span className="font-medium">{transaction.payee}</span>
              <span className="text-xs text-gray-400">
                {transaction.category?.name &&
                  `${transaction.category.name} · `}
                {new Date(transaction.date).toLocaleDateString("it-IT")}{" "}
              </span>
            </div>
            <span
              className={
                transaction.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {transaction.type === "income" ? "+" : "-"} €
              {String(transaction.amount)}{" "}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
