import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { useData } from "@/context/DataContext";
import { downloadCsv, downloadJson, printPage } from "@/utils/exportFile";
import { totalAssets, totalLiabilities, netWorth } from "@/utils/calculations";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });
function ReportsPage() {
  const { assets, liabilities, transactions } = useData();
  const button = "flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary";
  return <><PageHeader title="Reports" description="Export a local copy of records retrieved from the backend." actions={<button onClick={printPage} className={button}><Printer className="h-4 w-4" />Print</button>} /><div className="grid gap-4 sm:grid-cols-3"><article className="glass rounded-2xl p-5"><p className="text-sm text-muted-foreground">Total assets</p><p className="mt-2 text-2xl font-bold"><CurrencyDisplay value={totalAssets(assets)} /></p></article><article className="glass rounded-2xl p-5"><p className="text-sm text-muted-foreground">Total liabilities</p><p className="mt-2 text-2xl font-bold text-negative"><CurrencyDisplay value={totalLiabilities(liabilities)} /></p></article><article className="glass rounded-2xl p-5"><p className="text-sm text-muted-foreground">Net worth</p><p className="mt-2 text-2xl font-bold text-positive"><CurrencyDisplay value={netWorth(assets, liabilities)} /></p></article></div><div className="mt-6 grid gap-4 md:grid-cols-3"><ExportCard title="Assets" count={assets.length} onCsv={() => downloadCsv(assets, "assetscape-assets.csv")} /><ExportCard title="Liabilities" count={liabilities.length} onCsv={() => downloadCsv(liabilities, "assetscape-liabilities.csv")} /><ExportCard title="Transactions" count={transactions.length} onCsv={() => downloadCsv(transactions, "assetscape-transactions.csv")} /></div><button onClick={() => downloadJson({ assets, liabilities, transactions }, "assetscape-portfolio.json")} className="mt-4 flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" />Download complete JSON backup</button></>;
}
function ExportCard({ title, count, onCsv }) { return <article className="rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{count} records</p><button onClick={onCsv} className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary"><Download className="h-4 w-4" />Export CSV</button></article>; }
