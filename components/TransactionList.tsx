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
        <CardTitle className="label-xs-plain">Ultime transazioni</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <div className="flex flex-col">
              <span className="value-sm">{transaction.payee}</span>
              <span className="label-xs-plain">
                {transaction.category?.name &&
                  `${transaction.category.name} · `}
                {new Date(transaction.date).toLocaleDateString("it-IT")}{" "}
              </span>
            </div>
            <span
              className={
                transaction.type === "income"
                  ? "value-positive"
                  : "value-negative"
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
