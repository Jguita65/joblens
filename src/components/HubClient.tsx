"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { useLang } from "./LanguageProvider";

export default function HubClient({ name }: { name: string }) {
  const { lang, t } = useLang();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("hub.greeting", { name })}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t("hub.intro")}</p>
      </div>

      <Link
        href="/guia"
        className="mb-6 flex items-center justify-between rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand/10 dark:border-brand-400/30 dark:text-brand-400"
      >
        <span>📘 {t("hub.guideBanner")}</span>
        <span>→</span>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="card group flex flex-col gap-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-2xl">
              {tool.icon}
            </div>
            <h2 className="mt-1 font-semibold text-slate-900 dark:text-white">
              {tool.title[lang]}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tool.description[lang]}
            </p>
            <span className="mt-1 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
              {t("hub.open")}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
