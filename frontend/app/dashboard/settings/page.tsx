// app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Check } from "lucide-react";

type Account = {
  id?: string;
  name: string;
  email: string;
};

type TenantSettings = {
  id?: string;
  username: string;
  displayName: string;
  customDomain: string | null;
  isPublic: boolean;
};

export default function SettingsPage() {
  const [account, setAccount] = useState<Account>({ name: "", email: "" });
  const [tenant, setTenant] = useState<TenantSettings>({
    username: "",
    displayName: "",
    customDomain: "",
    isPublic: true,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSaved, setAccountSaved] = useState(false);

  const [savingTenant, setSavingTenant] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantSaved, setTenantSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [accountRes, tenantRes] = await Promise.all([
          fetch("/api/account"),
          fetch("/api/tenant"),
        ]);

        if (!accountRes.ok || !tenantRes.ok) {
          throw new Error("Failed to load settings");
        }

        setAccount(await accountRes.json());
        const tenantData = await tenantRes.json();
        setTenant({
          ...tenantData,
          customDomain: tenantData.customDomain ?? "",
        });
      } catch (err) {
        setLoadError(
          "Couldn't load your settings. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSaveAccount() {
    setSavingAccount(true);
    setAccountError(null);
    setAccountSaved(false);

    try {
      const body: Record<string, string> = {
        name: account.name,
        email: account.email,
      };

      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save account");
      }

      setAccount(data);
      setCurrentPassword("");
      setNewPassword("");
      setAccountSaved(true);
      setTimeout(() => setAccountSaved(false), 2000);
    } catch (err) {
      setAccountError(
        err instanceof Error ? err.message : "Failed to save account",
      );
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleSaveTenant() {
    setSavingTenant(true);
    setTenantError(null);
    setTenantSaved(false);

    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenant),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save site settings");
      }

      setTenant({ ...data, customDomain: data.customDomain ?? "" });
      setTenantSaved(true);
      setTimeout(() => setTenantSaved(false), 2000);
    } catch (err) {
      setTenantError(
        err instanceof Error ? err.message : "Failed to save site settings",
      );
    } finally {
      setSavingTenant(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-sage" size={28} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <p className="text-sm text-red-500">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors group mb-6"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to Dashboard
        </Link>

        <div className="border-b border-text/5 pb-6 mb-8">
          <h1 className="text-2xl font-extrabold text-text tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-text-light mt-1">
            Manage your login details and how your site is published.
          </p>
        </div>

        {/* Account Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 p-6 mb-8">
          <h3 className="font-bold text-text mb-4">Account</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Name
              </label>
              <input
                type="text"
                value={account.name}
                onChange={(e) =>
                  setAccount((a) => ({ ...a, name: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Email
              </label>
              <input
                type="email"
                value={account.email}
                onChange={(e) =>
                  setAccount((a) => ({ ...a, email: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div className="pt-2 border-t border-text/5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Only needed to change password"
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
            </div>

            {accountError && (
              <p className="text-sm text-red-500">{accountError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveAccount}
                disabled={savingAccount}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {savingAccount && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Save Account
              </button>

              {accountSaved && (
                <span className="inline-flex items-center gap-1 text-sm text-sage font-medium">
                  <Check size={16} /> Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Site Settings Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 p-6">
          <h3 className="font-bold text-text mb-4">Site Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Username
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-button border border-text/10 px-4 py-2.5 focus-within:ring-2 focus-within:ring-sage/40">
                <span className="text-sm text-text-light/50">webnest.com/</span>
                <input
                  type="text"
                  value={tenant.username}
                  onChange={(e) =>
                    setTenant((t) => ({ ...t, username: e.target.value }))
                  }
                  className="flex-1 text-sm text-text bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Display Name
              </label>
              <input
                type="text"
                value={tenant.displayName}
                onChange={(e) =>
                  setTenant((t) => ({ ...t, displayName: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Custom Domain
              </label>
              <input
                type="text"
                value={tenant.customDomain ?? ""}
                onChange={(e) =>
                  setTenant((t) => ({ ...t, customDomain: e.target.value }))
                }
                placeholder="e.g. yourname.com"
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-text pt-2">
              <input
                type="checkbox"
                checked={tenant.isPublic}
                onChange={(e) =>
                  setTenant((t) => ({ ...t, isPublic: e.target.checked }))
                }
                className="accent-sage"
              />
              Make my site publicly visible
            </label>

            {tenantError && (
              <p className="text-sm text-red-500">{tenantError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveTenant}
                disabled={savingTenant}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {savingTenant && <Loader2 size={16} className="animate-spin" />}
                Save Site Settings
              </button>

              {tenantSaved && (
                <span className="inline-flex items-center gap-1 text-sm text-sage font-medium">
                  <Check size={16} /> Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
