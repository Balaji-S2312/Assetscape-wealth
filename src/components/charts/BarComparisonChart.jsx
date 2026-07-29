import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { axisProps, gridProps } from "@/components/charts/chartTheme";

/** Grouped bar chart. `bars` = [{ dataKey, name, color }] */
export default function BarComparisonChart({ data, bars, height = 280, suffix = "", currency = true }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }} barGap={6}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          width={currency ? 60 : 40}
          tickFormatter={(v) => (currency ? `${Math.round(v / 1000)}k` : `${v}${suffix}`)}
        />
        <Tooltip
          cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
          content={
            <ChartTooltip
              currencyKeys={currency ? bars.map((b) => b.dataKey) : ["__none__"]}
              suffix={suffix}
            />
          }
        />
        {bars.length > 1 ? (
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        ) : null}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
