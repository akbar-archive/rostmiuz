"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

const TIMEOUT_MS = 8000;

export default function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keyed by url rather than reset-on-change, so we never need a
  // synchronous setState at the top of the effect (trips the
  // set-state-in-effect lint, and is a real cascading-render footgun).
  const [state, setState] = useState<{ url: string; ready: boolean; timedOut: boolean }>({
    url: "",
    ready: false,
    timedOut: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe")) {
        setState({ url, ready: true, timedOut: false });
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const process = () => window.instgrm?.Embeds.process();
    const existingScript = document.getElementById("instagram-embed-script");

    if (window.instgrm) {
      process();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", process);
    }

    const timeout = setTimeout(() => {
      setState((s) => (s.url === url && s.ready ? s : { url, ready: false, timedOut: true }));
    }, TIMEOUT_MS);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [url]);

  const ready = state.url === url && state.ready;
  const timedOut = state.url === url && state.timedOut;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800"
      style={{ minHeight: ready ? undefined : 260 }}
    >
      {!ready && !timedOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400 dark:text-neutral-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-xs">Loading Instagram post…</p>
        </div>
      )}

      {timedOut && !ready ? (
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Couldn&apos;t load the embedded post.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2.25} />
            View on Instagram
          </a>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`flex justify-center transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: 0, width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
