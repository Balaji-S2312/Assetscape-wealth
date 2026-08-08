import { createFileRoute } from "@tanstack/react-router";
import { Coins, Landmark, TrendingUp, Wallet } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import NetWorthChart from "@/components/charts/NetWorthChart";
import DonutChart from "@/components/charts/DonutChart";
import HealthGauge from "@/components/charts/HealthGauge";
import TransactionTable from "@/components/dashboard/TransactionTable";
import Loader from "@/components/common/Loader";
import { useData } from "@/context/DataContext";
import { totalAssets, totalLiabilities, netWorth, healthScore, allocationByCategory, netWorthTrend, availableCash } from "@/utils/calculations";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Overview — Assetscape Wealth Dashboard" },
      { name: "description", content: "Net worth, assets, liabilities and financial health overview." },
      { property: "og:title", content: "Overview — Assetscape Wealth Dashboard" },
      { property: "og:description", content: "Your net worth and portfolio health at a glance." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { assets, liabilities, transactions, loading } = useData();

  if (loading) return <Loader label="Loading your portfolio…" />;

  const assetsTotal = totalAssets(assets);
  const liabilitiesTotal = totalLiabilities(liabilities);

  return (
    <>
      <PageHeader title="Overview" description="A live snapshot of everything you own and owe." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Net worth" value={netWorth(assets, liabilities)} icon={TrendingUp} tone="primary" />
        <StatCard label="Total assets" value={assetsTotal} icon={Coins} tone="positive" />
        <StatCard label="Total liabilities" value={liabilitiesTotal} icon={Landmark} tone="negative" />
        <StatCard label="Liquid holdings" value={availableCash(assets)} icon={Wallet} tone="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Net worth trend" subtitle="Last 12 months" className="lg:col-span-2">
          <NetWorthChart data={netWorthTrend(assets, liabilities, transactions)} />
        </ChartCard>
        <ChartCard title="Financial health" subtitle="Based on debt-to-asset ratio">
          <HealthGauge score={healthScore(assets, liabilities, transactions)} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Allocation" subtitle="By asset category">
          <DonutChart data={allocationByCategory(assets)} />
        </ChartCard>
        <ChartCard title="Recent activity" subtitle="Latest transactions" className="lg:col-span-2">
          <TransactionTable transactions={transactions.slice(0, 6)} compact />
        </ChartCard>
      </div>
    </>
  );
}
