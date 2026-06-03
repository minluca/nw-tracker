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
        <p className="text-3xl font-semibold">
          € {totalNw.toLocaleString("it-IT")}
        </p>
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
            <p className="text-xs text-gray-400">Liquidità</p>
            <p className="font-medium">€ {liquidity.toLocaleString("it-IT")}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Investimenti</p>
            <p className="font-medium">
              € {investments.toLocaleString("it-IT")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
