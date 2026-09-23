"use client";

import { Lock, Mail, KeyRound, Loader2, LogIn, MapPin } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { inputClass } from "@/lib/styles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LoginForm() {
  const { email, setEmail, password, setPassword, error, submitting, handleSubmit } = useLogin();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="animate-pop-in w-full max-w-sm space-y-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
            <MapPin className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.brand}</h1>
          <p className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Lock className="h-3 w-3" />
            {t.login.tagline}
          </p>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <Mail className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2.25} />
            {t.login.email}
          </label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <KeyRound className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2.25} />
            {t.login.password}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && (
          <p className="animate-pop-in rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="press-bounce flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" strokeWidth={2.25} />}
          {submitting ? t.login.signingIn : t.login.signIn}
        </button>
      </form>
    </div>
  );
}
