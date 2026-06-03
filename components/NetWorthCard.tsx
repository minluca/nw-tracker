import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type NetWorthCardProps = {
  liquidity: number;
  investments: number;
  totalNw: number;
  previousMonthDelta: number | null;
};

export default function NetWorthCard({
  liquidity,
  investments,
  totalNw,
  previousMonthDelta,
}: NetWorthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="value-lg">€ {totalNw.toLocaleString("it-IT")}</p>
        {previousMonthDelta !== null && (
          <p
            className={`text-sm mt-1 ${previousMonthDelta >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {previousMonthDelta >= 0 ? "+" : ""}€{" "}
            {previousMonthDelta.toLocaleString("it-IT")} vs mese scorso
          </p>
        )}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="label-xs">Liquidità</p>
            <p className="value-md">€ {liquidity.toLocaleString("it-IT")}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="label-xs">Investimenti</p>
            <p className="value-md">€ {investments.toLocaleString("it-IT")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
