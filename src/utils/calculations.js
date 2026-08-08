/** Derived financial calculations from mock state. */
export function assetGrowth(asset) {
  if (!asset?.purchaseValue) return 0;
  return ((asset.currentValue - asset.purchaseValue) / asset.purchaseValue) * 100;
}

export function assetProfit(asset) {
  return (asset?.currentValue ?? 0) - (asset?.purchaseValue ?? 0);
}

export function totalAssets(assets = []) {
  return assets
    .filter((a) => a.status !== "Sold")
    .reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
}

export function totalLiabilities(liabilities = []) {
  return liabilities
    .filter((l) => l.status !== "Closed")
    .reduce((sum, l) => sum + (Number(l.outstanding) || 0), 0);
}

export function netWorth(assets, liabilities) {
  return totalAssets(assets) - totalLiabilities(liabilities);
}

export function investmentValue(assets = []) {
  return assets
    .filter((a) => ["Investment", "Business", "Gold"].includes(a.category))
    .reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
}

export function availableCash(assets = []) {
  return assets
    .filter((a) => ["Cash", "Savings"].includes(a.category))
    .reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
}

export function allocationByCategory(assets = []) {
  const map = new Map();
  assets
    .filter((a) => a.status !== "Sold")
    .forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + Number(a.currentValue || 0)));
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function liabilityBreakdown(liabilities = []) {
  const map = new Map();
  liabilities
    .filter((l) => l.status !== "Closed")
    .forEach((l) => map.set(l.category, (map.get(l.category) ?? 0) + Number(l.outstanding || 0)));
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

export function debtToAssetRatio(assets, liabilities) {
  const a = totalAssets(assets);
  return a === 0 ? 0 : (totalLiabilities(liabilities) / a) * 100;
}

export function diversityScore(assets = []) {
  const alloc = allocationByCategory(assets);
  const total = alloc.reduce((s, a) => s + a.value, 0);
  if (!total || alloc.length < 2) return 0;
  const hhi = alloc.reduce((s, a) => s + (a.value / total) ** 2, 0);
  return Math.round((1 - hhi) * 111);
}

export function savingsRatio(transactions = []) {
  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spend = transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  if (!income) return 0;
  return Math.max(0, ((income - spend) / income) * 100);
}

export function healthScore(assets, liabilities, transactions) {
  const ratio = debtToAssetRatio(assets, liabilities);
  const debtScore = Math.max(0, 100 - ratio * 1.6);
  const diversity = diversityScore(assets);
  const savings = Math.min(100, savingsRatio(transactions) * 1.8);
  return Math.round(debtScore * 0.45 + diversity * 0.3 + savings * 0.25);
}

export function topPerformers(assets = [], count = 5) {
  return [...assets]
    .map((a) => ({ ...a, growth: assetGrowth(a) }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, count);
}

export function monthlyGrowthPercent(assets = []) {
  const total = totalAssets(assets);
  if (!total) return 0;
  const gain = assets.reduce((s, a) => s + assetProfit(a), 0);
  return Math.min(12, Math.max(-12, (gain / total) * 12));
}

/** Builds a 12-month net-worth trend from persisted transactions and the current balance sheet. */
export function netWorthTrend(assets = [], liabilities = [], transactions = []) {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en", { month: "short" }),
      change: 0,
    };
  });
  const byKey = new Map(months.map((month) => [month.key, month]));
  for (const transaction of transactions) {
    const key = String(transaction.date || "").slice(0, 7);
    const month = byKey.get(key);
    if (month) month.change += Number(transaction.amount) || 0;
  }
  let value = netWorth(assets, liabilities);
  const reversed = [];
  for (let index = months.length - 1; index >= 0; index -= 1) {
    reversed.push({ label: months[index].label, value: Math.round(value) });
    value -= months[index].change;
  }
  return reversed.reverse();
}
