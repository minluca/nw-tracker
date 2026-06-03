import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type CashflowCardProps = {
  income: number;
  expenses: number;
};

export default function CashflowCard({ income, expenses }: CashflowCardProps) {
  const balance = income - expenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">Mese corrente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Entrate</p>
            <p className="font-medium text-green-500">
              + € {income.toLocaleString("it-IT")}
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Uscite</p>
            <p className="font-medium text-red-500">
              - € {expenses.toLocaleString("it-IT")}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <p className="text-xs text-gray-400">Bilancio</p>
          <p
            className={`font-medium ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {balance >= 0 ? "+" : ""}€ {balance.toLocaleString("it-IT")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
