import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { CHART_COLORS } from "@/components/charts/chartTheme";
import { useChartAnimation, chartSignature } from "@/hooks/useChartAnimation";

/** Doughnut chart for allocation / breakdown views. */
export default function DonutChart({ data, height = 280, innerRadius = 62, outerRadius = 96 }) {
  const scope = useChartAnimation(chartSignature(data));

  return (
    <div ref={scope} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
