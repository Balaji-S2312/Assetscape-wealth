// Mock chart series for dashboard and analytics views.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const netWorthSeries = {
  "7d": [
    { label: "Mon", netWorth: 371200, assets: 483900, liabilities: 112700 },
    { label: "Tue", netWorth: 371800, assets: 484400, liabilities: 112600 },
    { label: "Wed", netWorth: 372100, assets: 484800, liabilities: 112700 },
    { label: "Thu", netWorth: 372600, assets: 485200, liabilities: 112600 },
    { label: "Fri", netWorth: 372900, assets: 485600, liabilities: 112700 },
    { label: "Sat", netWorth: 373200, assets: 485900, liabilities: 112700 },
    { label: "Sun", netWorth: 373450, assets: 486250, liabilities: 112800 },
  ],
  "30d": Array.from({ length: 10 }, (_, i) => ({
    label: `D${i * 3 + 1}`,
    netWorth: 366000 + i * 830,
    assets: 478000 + i * 920,
    liabilities: 114000 - i * 130,
  })),
  "6m": months.slice(1, 7).map((label, i) => ({
    label,
    netWorth: 341000 + i * 6500,
    assets: 455000 + i * 6200,
    liabilities: 118000 - i * 900,
  })),
  "1y": months.map((label, i) => ({
    label,
    netWorth: 302000 + i * 6500,
    assets: 421000 + i * 5900,
    liabilities: 122000 - i * 850,
  })),
  all: [
    { label: "2020", netWorth: 118000, assets: 205000, liabilities: 87000 },
    { label: "2021", netWorth: 164000, assets: 268000, liabilities: 104000 },
    { label: "2022", netWorth: 212000, assets: 330000, liabilities: 118000 },
    { label: "2023", netWorth: 268000, assets: 391000, liabilities: 123000 },
    { label: "2024", netWorth: 312000, assets: 432000, liabilities: 120000 },
    { label: "2025", netWorth: 348000, assets: 465000, liabilities: 117000 },
    { label: "2026", netWorth: 373450, assets: 486250, liabilities: 112800 },
  ],
};

export const cashFlowSeries = months.slice(0, 8).map((label, i) => ({
  label,
  income: 7200 + (i % 3) * 480,
  expenditure: 4100 + (i % 4) * 320,
}));

export const appreciationSeries = [
  { label: "Property", appreciation: 68400, depreciation: 0 },
  { label: "Investment", appreciation: 54350, depreciation: 0 },
  { label: "Gold", appreciation: 8350, depreciation: 0 },
  { label: "Vehicle", appreciation: 0, depreciation: 12400 },
  { label: "Electronics", appreciation: 0, depreciation: 3700 },
  { label: "Collectibles", appreciation: 5400, depreciation: 0 },
];

export const investmentPerformance = months.slice(0, 9).map((label, i) => ({
  label,
  portfolio: 132000 + i * 4200,
  benchmark: 132000 + i * 3100,
}));

export const monthlyGrowthSeries = months.slice(0, 8).map((label, i) => ({
  label,
  growth: Number((2.4 + Math.sin(i) * 1.6 + i * 0.18).toFixed(2)),
}));

export const upcomingPayments = [
  { id: "UP-1", name: "Riverside Mortgage", due: "2026-08-01", amount: 842 },
  { id: "UP-2", name: "Vehicle Finance", due: "2026-08-03", amount: 468 },
  { id: "UP-3", name: "Platinum Credit Card", due: "2026-08-05", amount: 260 },
  { id: "UP-4", name: "Business Facility", due: "2026-08-11", amount: 412 },
  { id: "UP-5", name: "Study Loan", due: "2026-08-14", amount: 195 },
];

export const notifications = [
  { id: "N-1", title: "Net worth up 4.8% this month", time: "2 hours ago", tone: "positive" },
  { id: "N-2", title: "Credit card balance marked overdue", time: "Yesterday", tone: "negative" },
  { id: "N-3", title: "Savings bond matures in 8 months", time: "3 days ago", tone: "neutral" },
  { id: "N-4", title: "Gold holding hit an all-time high", time: "Last week", tone: "positive" },
];

export const testimonials = [
  {
    id: "T-1",
    name: "Amelia Hart",
    role: "Product Director, Leeds",
    quote:
      "Assetscape Wealth replaced four spreadsheets. Seeing property, portfolio and debt in one view changed how I plan.",
  },
  {
    id: "T-2",
    name: "Daniel Okafor",
    role: "Founder, Manchester",
    quote:
      "The analytics view is genuinely excellent. Debt-to-asset ratio tracking alone paid for itself.",
  },
  {
    id: "T-3",
    name: "Priya Raman",
    role: "Senior Engineer, London",
    quote:
      "Clean, fast, and private. Everything stays on my device and the reporting is portfolio-grade.",
  },
];
