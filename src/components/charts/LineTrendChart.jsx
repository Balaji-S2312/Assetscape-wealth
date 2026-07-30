import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { axisProps, gridProps } from "@/components/charts/chartTheme";
import { useChartAnimation, chartSignature } from "@/hooks/useChartAnimation";

/** Multi-series line chart. `lines` = [{ dataKey, name, color }] */
export default function LineTrendChart({ data, lines, height = 280, currency = true, suffix = "" }) {
  const scope = useChartAnimation(chartSignature(data, lines.map((l) => l.dataKey).join(",")));

  return (
    <div ref={scope} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            {...axisProps}
            width={currency ? 60 : 40}
            tickFormatter={(v) => (currency ? `${Math.round(v / 1000)}k` : `${v}${suffix}`)}
          />
          <Tooltip
            content={
              <ChartTooltip
                currencyKeys={currency ? lines.map((l) => l.dataKey) : ["__none__"]}
                suffix={suffix}
              />
            }
          />
          {lines.length > 1 ? (
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          ) : null}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
