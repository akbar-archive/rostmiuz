"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useChangePassword } from "@/hooks/useChangePassword";
import { signOut } from "@/lib/auth";
import { inputClass } from "@/lib/styles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import ConfettiBurst from "@/components/ConfettiBurst";

function useFriendlyDate() {
  const { t } = useLanguage();
  return function formatFriendlyDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    const now = new Date();
    const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    if (date.toDateString() === now.toDateString()) return t.me.today(time);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return t.me.yesterday(time);

    return `${date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} ${time}`;
  };
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-150 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function MePage() {
  const { user } = useAuthUser();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const { t } = useLanguage();
  const formatFriendlyDate = useFriendlyDate();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    saving,
    error,
    success,
    handleSubmit,
  } = useChangePassword(user);

  useEffect(() => {
    if (!success) return;
    // Deferred rather than called synchronously in the effect body itself
    // — avoids triggering a same-tick cascading render.
    const timeout = setTimeout(() => setBurstKey((k) => k + 1), 0);
    return () => clearTimeout(timeout);
  }, [success]);

  if (!user) return null;

  const hasPasswordProvider = user.providerData.some((p) => p.providerId === "password");
  const providers = user.providerData.map((p) => p.providerId);
  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="animate-pop-in flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xl font-semibold text-white">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">{user.email}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {providers.map((p) => (
              <span
                key={p}
                className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
              >
                {p === "password" ? t.me.providerPassword : p === "google.com" ? t.me.providerGoogle : p}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm(t.me.signOutConfirm)) signOut();
          }}
          className="press-bounce flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.25} />
          {t.me.signOut}
        </button>
      </div>

      <div className="animate-pop-in grid gap-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Calendar className="h-4 w-4 text-neutral-400" strokeWidth={2.25} />
          {t.me.memberSince(formatFriendlyDate(user.metadata.creationTime))}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Clock className="h-4 w-4 text-neutral-400" strokeWidth={2.25} />
          {t.me.lastSignIn(formatFriendlyDate(user.metadata.lastSignInTime))}
        </div>
      </div>

      <div className="animate-pop-in overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setPasswordOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between gap-1.5 p-5 text-left text-sm font-semibold text-neutral-900 transition-colors duration-150 hover:bg-neutral-50 sm:p-6 dark:text-neutral-100 dark:hover:bg-neutral-800/50"
        >
          <span className="flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-neutral-400" strokeWidth={2.25} />
            {t.me.changePassword}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${passwordOpen ? "rotate-180" : ""}`}
            strokeWidth={2.25}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            passwordOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              {!hasPasswordProvider ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.me.noPasswordProvider}</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <PasswordField
                    label={t.me.currentPassword}
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    autoComplete="current-password"
                  />
                  <PasswordField
                    label={t.me.newPassword}
                    value={newPassword}
                    onChange={setNewPassword}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    label={t.me.confirmPassword}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                  />
                  {error && (
                    <p className="animate-pop-in rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="animate-pop-in flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      {t.me.passwordUpdated}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="press-bounce relative flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" strokeWidth={2.25} />
                    )}
                    {saving ? t.me.updating : t.me.updatePassword}
                    <ConfettiBurst triggerKey={burstKey} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
