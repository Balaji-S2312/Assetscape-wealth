import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Coins,
  Landmark,
  ArrowLeftRight,
  PieChart,
  FileText,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NAV_ITEMS = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Assets", to: "/dashboard/assets", icon: Coins },
  { label: "Liabilities", to: "/dashboard/liabilities", icon: Landmark },
  { label: "Transactions", to: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Analytics", to: "/dashboard/analytics", icon: PieChart },
  { label: "Reports", to: "/dashboard/reports", icon: FileText },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export function SidebarNav({ collapsed = false, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard sections">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: Boolean(item.exact) }}
          activeProps={{ className: "brand-gradient text-primary-foreground" }}
          inactiveProps={{ className: "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          title={item.label}
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 transition-[width] duration-300 lg:flex no-print ${
        collapsed ? "w-[5.25rem]" : "w-64"
      }`}
    >
      <Link to="/" className="mb-6 flex items-center gap-2.5 px-1">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient">
          <Sparkles className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
        </span>
        {!collapsed ? <span className="truncate text-lg font-bold">Assetscape Wealth</span> : null}
      </Link>

      <SidebarNav collapsed={collapsed} />

      <div className="mt-4 flex flex-col gap-1 border-t border-sidebar-border pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-negative/12 hover:text-negative"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          {!collapsed ? <span>Logout</span> : <span className="sr-only">Logout</span>}
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4.5 w-4.5 shrink-0" />
          ) : (
            <PanelLeftClose className="h-4.5 w-4.5 shrink-0" />
          )}
          {!collapsed ? <span>Collapse</span> : null}
        </button>
      </div>
    </aside>
  );
}
