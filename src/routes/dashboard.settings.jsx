import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });
function SettingsPage() {
  const { changePassword } = useAuth(); const { settings, updateSetting } = useSettings();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" }); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(e) { e.preventDefault(); setMessage(""); setError(""); try { await changePassword(passwords); setMessage("Password updated. Other refresh sessions were revoked."); setPasswords({ currentPassword: "", newPassword: "" }); } catch (x) { setError(x.message); } }
  const field = "mt-1 h-11 w-full rounded-xl border border-border bg-background px-3";
  return <><PageHeader title="Settings" description="Display preferences stay local; security settings are stored in the backend." /><div className="grid gap-6 lg:grid-cols-2"><section className="glass rounded-2xl p-6"><h2 className="font-semibold">Display</h2><label className="mt-5 block text-sm">Currency<select className={field} value={settings.currency} onChange={(e) => updateSetting("currency", e.target.value)}><option>INR</option><option>USD</option><option>GBP</option><option>EUR</option></select></label><label className="mt-4 flex items-center justify-between rounded-xl border border-border p-4 text-sm"><span>Interface animations</span><input type="checkbox" checked={settings.animations} onChange={(e) => updateSetting("animations", e.target.checked)} /></label></section><section className="glass rounded-2xl p-6"><h2 className="font-semibold">Change password</h2>{message ? <p className="mt-3 text-sm text-positive">{message}</p> : null}{error ? <p className="mt-3 text-sm text-negative">{error}</p> : null}<form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-sm">Current password<input className={field} type="password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label><label className="block text-sm">New password<input className={field} type="password" minLength={8} required value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label><button className="w-full rounded-xl brand-gradient px-4 py-2.5 font-semibold text-primary-foreground">Update password</button></form></section></div></>;
}
