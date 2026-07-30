import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useChartAnimation, chartSignature } from "@/hooks/useChartAnimation";

/** Compact sparkline used inside cards and tables. */
export default function Sparkline({ data, dataKey = "value", color = "var(--chart-1)", height = 48 }) {
  const gradientId = `spark-${dataKey}-${color.replace(/[^a-z0-9]/gi, "")}`;
  const scope = useChartAnimation(chartSignature(data, dataKey));

  return (
    <div ref={scope} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
