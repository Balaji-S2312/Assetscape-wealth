import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/layout/PageHeader";
import ChartCard from "@/components/dashboard/ChartCard";
import DonutChart from "@/components/charts/DonutChart";
import BarComparisonChart from "@/components/charts/BarComparisonChart";
import HealthGauge from "@/components/charts/HealthGauge";
import { useData } from "@/context/DataContext";
import { allocationByCategory, healthScore, totalAssets, totalLiabilities } from "@/utils/calculations";

export const Route = createFileRoute("/dashboard/analytics")({ component: AnalyticsPage });
function AnalyticsPage() {
  const { assets, liabilities, transactions } = useData();
  const comparison = [{ label: "Portfolio", assets: totalAssets(assets), liabilities: totalLiabilities(liabilities) }];
  const bars = [{ dataKey: "assets", name: "Assets", color: "var(--positive)" }, { dataKey: "liabilities", name: "Liabilities", color: "var(--negative)" }];
  return <><PageHeader title="Analytics" description="Calculated from your persisted asset, debt, and transaction records." /><div className="grid gap-4 lg:grid-cols-3"><ChartCard title="Asset allocation" subtitle="By category"><DonutChart data={allocationByCategory(assets)} /></ChartCard><ChartCard title="Assets versus liabilities" subtitle="Current values" className="lg:col-span-2"><BarComparisonChart data={comparison} bars={bars} /></ChartCard><ChartCard title="Financial health" subtitle="Debt, diversity, and savings"><HealthGauge score={healthScore(assets, liabilities, transactions)} /></ChartCard><div className="glass rounded-2xl p-6 lg:col-span-2"><h2 className="font-semibold">How the score works</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">The score is deterministic. It combines debt-to-asset ratio, portfolio diversity, and savings behaviour. No AI API or external financial service is required.</p></div></div></>;
}
