import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/dashboard/profile")({ component: ProfilePage });
function ProfilePage() {
  const { profile, saveProfile } = useAuth(); const [form, setForm] = useState(null); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { if (profile) setForm({ fullName: profile.fullName || "", phone: profile.phone || "", occupation: profile.occupation || "", currency: profile.currency || "INR", country: profile.country || "India", bio: profile.bio || "", avatar: profile.avatar || "" }); }, [profile]);
  if (!form) return null;
  async function submit(e) { e.preventDefault(); setMessage(""); setError(""); try { await saveProfile(form); setMessage("Profile saved to PostgreSQL."); } catch (x) { setError(x.message); } }
  const field = "mt-1 h-11 w-full rounded-xl border border-border bg-background px-3";
  return <><PageHeader title="Profile" description="This profile is retrieved after every successful login." /><form onSubmit={submit} className="glass grid max-w-3xl gap-5 rounded-2xl p-6 sm:grid-cols-2">{message ? <p className="sm:col-span-2 text-sm text-positive">{message}</p> : null}{error ? <p className="sm:col-span-2 text-sm text-negative">{error}</p> : null}<label className="text-sm">Full name<input className={field} required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label><label className="text-sm">Email<input className={field} disabled value={profile.email} /></label><label className="text-sm">Phone<input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label className="text-sm">Occupation<input className={field} value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} /></label><label className="text-sm">Currency<select className={field} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>INR</option><option>USD</option><option>GBP</option><option>EUR</option></select></label><label className="text-sm">Country<input className={field} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></label><label className="sm:col-span-2 text-sm">Bio<textarea className="mt-1 min-h-28 w-full rounded-xl border border-border bg-background p-3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label><button className="rounded-xl brand-gradient px-4 py-2.5 font-semibold text-primary-foreground sm:col-span-2">Save profile</button></form></>;
}
