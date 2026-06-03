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
        <CardTitle className="label-xs-plain">Mese corrente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex gap-3 px-4">
          <div className="flex-1 bg-secondary rounded-lg p-3">
            <p className="label-xs">Entrate</p>
            <p className="value-md value-positive">
              + € {income.toLocaleString("it-IT")}
            </p>
          </div>
          <div className="flex-1 bg-secondary rounded-lg p-3">
            <p className="label-xs">Uscite</p>
            <p className="value-md value-negative">
              - € {expenses.toLocaleString("it-IT")}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 mx-4 border-t flex justify-between items-center pb-4">
          <p className="value-sm">Bilancio</p>
          <p
            className={`value-md ${balance >= 0 ? "value-positive" : "value-negative"}`}
          >
            {balance >= 0 ? "+" : ""}€ {balance.toLocaleString("it-IT")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
