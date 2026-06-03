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
        <CardTitle className="label-xs-plain">Net Worth</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="value-lg numeric px-4">
          € {totalNw.toLocaleString("it-IT")}
        </p>
        {previousMonthDelta !== null && (
          <p
            className={`text-sm mt-1 px-4 ${previousMonthDelta >= 0 ? "value-positive" : "value-negative"}`}
          >
            {previousMonthDelta >= 0 ? "+" : ""}€{" "}
            {previousMonthDelta.toLocaleString("it-IT")} vs mese scorso
          </p>
        )}
        <div className="flex gap-3 mt-4 px-4 pb-4">
          <div className="flex-1 bg-secondary rounded-lg p-3">
            <p className="label-xs">Liquidità</p>
            <p className="value-md numeric">
              € {liquidity.toLocaleString("it-IT")}
            </p>
          </div>
          <div className="flex-1 bg-secondary rounded-lg p-3">
            <p className="label-xs">Investimenti</p>
            <p className="value-md numeric">
              € {investments.toLocaleString("it-IT")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
