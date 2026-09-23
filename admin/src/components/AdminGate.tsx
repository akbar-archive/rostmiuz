"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, LayoutDashboard } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Skeleton } from "./Skeleton";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginForm from "./LoginForm";

function SidebarLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 ${
        active
          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2.25} />
      {children}
    </Link>
  );
}

function Brand({ label }: { label: string }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition-transform duration-150 hover:scale-105">
        <MapPin className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{label}</span>
    </Link>
  );
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthUser();
  const pathname = usePathname();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 sm:flex dark:bg-neutral-950">
        <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white p-4 sm:flex dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2 px-1 py-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="mt-6 flex flex-1 flex-col gap-1">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <nav className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:hidden dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </nav>
          {/* No content mockup here on purpose: the page underneath (e.g.
              SkeletonList, SkeletonForm) renders its own accurate skeleton
              the instant auth resolves. Guessing the shape here too meant
              two different-looking skeletons flashed back to back. */}
          <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50 sm:flex dark:bg-neutral-950">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white p-4 sm:flex dark:border-neutral-800 dark:bg-neutral-900">
        <div className="px-1 py-1">
          <Brand label={t.brand} />
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          <SidebarLink href="/" active={pathname === "/"} icon={LayoutDashboard}>
            {t.nav.dashboard}
          </SidebarLink>
        </nav>

        <LanguageSwitcher className="mb-1" dropDirection="up" />

        <Link
          href="/me"
          className={`flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-150 ${
            pathname === "/me"
              ? "bg-rose-50 dark:bg-rose-950/40"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-white">
            {initial}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-neutral-700 dark:text-neutral-300">
            {user.email}
          </span>
        </Link>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <nav className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:hidden dark:border-neutral-800 dark:bg-neutral-900">
          <Brand label={t.brand} />
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Link
              href="/me"
              title={user.email ?? undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform duration-150 hover:scale-105 ${
                pathname === "/me" ? "ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-neutral-900" : ""
              } bg-neutral-800`}
            >
              {initial}
            </Link>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
