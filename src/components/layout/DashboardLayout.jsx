import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import Sidebar from "@/components/layout/Sidebar";
import MobileDrawer from "@/components/layout/MobileDrawer";
import Navbar from "@/components/layout/Navbar";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Loader from "@/components/common/Loader";
import { SearchProvider } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import useGsapContext from "@/hooks/useGsapContext";
import gsap from "gsap";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { isAuthenticated, initialising } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialising && !isAuthenticated) navigate({ to: "/login", replace: true });
  }, [initialising, isAuthenticated, navigate]);

  const scope = useGsapContext(() => {
    gsap.from("[data-route-content]", { opacity: 0, y: 16, duration: 0.45, ease: "power2.out" });
  });

  if (initialising || !isAuthenticated) return <Loader label="Restoring your secure session…" />;

  return (
    <SearchProvider value={query}>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onOpenDrawer={() => setDrawerOpen(true)} query={query} onQueryChange={setQuery} />
          <main ref={scope} className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div data-route-content className="mx-auto w-full max-w-7xl">
              <ErrorBoundary><Outlet /></ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
