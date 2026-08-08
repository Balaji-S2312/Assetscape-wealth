import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Sparkles, X } from "lucide-react";
import { SidebarNav } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function MobileDrawer({ open, onClose }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="fixed inset-0 z-[80] lg:hidden no-print">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar p-4 animate-in slide-in-from-left duration-200"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">Assetscape Wealth</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={onClose} />
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-xl border-t border-sidebar-border px-3 py-3 text-sm font-medium text-muted-foreground hover:text-negative"
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
