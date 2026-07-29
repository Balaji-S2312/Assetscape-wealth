## AssetSphere – Personal Asset Management Dashboard

Frontend-only build: no backend, no database, no auth provider, no API keys, no network requests. All data is local mock JavaScript with simulated promise delays.

### One necessary deviation

This platform's routing is TanStack Router (file-based). React Router DOM cannot be installed here — it would break the build. Everything else in your spec is met exactly: all app code in `.jsx`, no `.ts`/`.tsx` app files, no backend. Routing behaves identically (client-side navigation, nested layout, 404, redirects); only the import names differ, and it stays trivially swappable.

### Pages (all under `src/routes/`, `.jsx`)

`/` landing · `/login` · `/register` · `/dashboard` · `/dashboard/assets` · `/dashboard/assets/new` · `/dashboard/assets/$id` · `/dashboard/liabilities` · `/dashboard/liabilities/new` · `/dashboard/analytics` · `/dashboard/transactions` · `/dashboard/reports` · `/dashboard/profile` · `/dashboard/settings` · catch-all not-found.

`/dashboard` is a layout route (collapsible sidebar, topbar with search, notifications, theme toggle, profile menu, mobile drawer, breadcrumbs, page title, `<Outlet />`). Logout clears the demo flag and redirects to `/login`.

### Design system

Dark-default + light mode via a `ThemeContext` and `.dark` class. Tokens added to `src/styles.css`: deep navy/charcoal backgrounds, soft grey surfaces, emerald positive, red negative, violet/blue accent, gold premium, glass surface tokens, soft shadows, gradient highlights. No hardcoded colour utilities in components.

### Structure

```text
src/
  components/{common,dashboard,charts,forms,layout}/
  context/    ThemeContext, CurrencyContext, AuthContext(demo), DataContext, ToastContext
  data/       assets.js liabilities.js transactions.js chartData.js user.js
  hooks/      useReducedMotion, useGsapContext, useLocalStorage, usePagination, useFilters
  services/   mockAssetService, mockLiabilityService, mockTransactionService, mockAuthService
  utils/      currency.js format.js calculations.js exportFile.js
  routes/     (pages)
```

Services return promises with `setTimeout` delays; CRUD mutates in-memory state mirrored to localStorage. `DataContext` is the single source of truth so assets/liabilities/transactions/analytics stay consistent.

### Reusable components

Sidebar, Navbar, MobileDrawer, PageHeader, StatCard, ChartCard, AssetCard, LiabilityCard, DataTable, TransactionTable, SearchInput, FilterDropdown, Modal (focus-trapped, Esc-closable), ConfirmDialog, Toast, Loader, EmptyState, Badge, ThemeToggle, FormField, CurrencyDisplay, ProgressBar, HealthGauge, ErrorBoundary.

### Feature detail

- **Landing**: nav, hero with GSAP entrance, floating asset cards, animated net-worth chart, features, asset categories, analytics preview, security section, testimonials, final CTA, footer — with ScrollTrigger reveals and light parallax.
- **Dashboard**: six animated counter stat cards using your exact figures (£486,250 / £112,800 / £373,450 / 4.8% / £168,400 / £24,750), net-worth line, allocation doughnut, asset-vs-liability bars, income/expense chart, recent transactions, top performers, upcoming payments, health indicator, growth progress cards.
- **Assets / Liabilities**: search, category + status filters, sort, grid/table toggle, summary cards, pagination, empty state, delete confirm, full add/edit/delete in state.
- **Add/Edit forms**: multi-section, validation with inline errors, progress indicator, local `URL.createObjectURL()` image preview, save/reset/cancel, success toast.
- **Asset details**: full metrics, profit/loss, performance chart from mock history, edit/delete/back.
- **Analytics**: all listed charts and scores plus 7d/30d/6m/1y/all filters that reshape mock series.
- **Transactions**: table with type/category/date/amount filters, add/edit modals, delete confirm, pagination.
- **Reports**: six report cards with preview, `window.print()`, and client-side CSV/JSON download via Blob.
- **Profile / Settings**: edit modal, localStorage persistence, theme, currency (GBP/INR/USD/EUR formatting only), language, notifications, layout + animation preference, privacy section, reset mock data.
- **Auth UI**: demo credentials `demo@assetsphere.com` / `Demo@123` validated in `mockAuthService`, localStorage flag only, forgot-password modal, password toggle, remember me.

### Animation

`gsap` + ScrollTrigger installed. All animations inside `gsap.context()` with cleanup on unmount, centralised in a `useGsapContext` hook; `prefers-reduced-motion` (and the settings toggle) disables non-essential motion.

### SEO / metadata

Each route gets its own `head()` with unique title, description, og and twitter tags.
