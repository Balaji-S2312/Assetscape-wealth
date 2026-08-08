import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { axisProps, gridProps } from "@/components/charts/chartTheme";
import { useChartAnimation, chartSignature } from "@/hooks/useChartAnimation";

/** Net-worth trend area chart. */
export default function NetWorthChart({ data, height = 280, showAssets = false }) {
  const scope = useChartAnimation(chartSignature(data, showAssets));

  return (
    <div ref={scope} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="netWorthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="assetsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} width={64} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
          <Tooltip content={<ChartTooltip currencyKeys={["netWorth", "assets", "liabilities"]} />} />
          {showAssets ? (
            <Area
              type="monotone"
              dataKey="assets"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#assetsFill)"
              name="Assets"
              isAnimationActive={false}
            />
          ) : null}
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#netWorthFill)"
            name="Net worth"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
