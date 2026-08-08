import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, LogOut, User, Settings, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import SearchInput from "@/components/common/SearchInput";
import { useAuth } from "@/context/AuthContext";
import { notifications } from "@/data/chartData";
import { initials } from "@/utils/format";

export default function Navbar({ onOpenDrawer, query, onQueryChange }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl no-print">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden lg:block" />
        <div className="min-w-0">
          <SearchInput
            value={query}
            onChange={onQueryChange}
            placeholder="Search assets, liabilities, transactions…"
            className="max-w-lg"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setBellOpen((v) => !v)}
              aria-label="Notifications"
              aria-expanded={bellOpen}
              className="press relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-secondary"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-negative" />
            </button>
            {bellOpen ? (
              <div className="glass-strong absolute right-0 top-12 z-50 w-72 rounded-2xl p-2">
                <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notifications
                </p>
                <ul>
                  {notifications.map((item) => (
                    <li key={item.id} className="rounded-xl px-2 py-2 hover:bg-secondary">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Open profile menu"
              className="press flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 hover:bg-secondary"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg brand-gradient text-xs font-bold text-primary-foreground">
                {initials(profile.fullName)}
              </span>
              <span className="hidden max-w-24 truncate text-sm font-medium sm:block">
                {profile.fullName}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
            {menuOpen ? (
              <div className="glass-strong absolute right-0 top-12 z-50 w-52 rounded-2xl p-2">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-negative hover:bg-negative/12"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
