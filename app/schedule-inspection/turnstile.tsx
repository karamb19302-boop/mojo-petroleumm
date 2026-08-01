"use client";

import { useEffect, useRef, useState } from "react";

declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; theme: "light" | "dark" }) => string; remove: (id: string) => void } } }

export function Turnstile({ onToken, onReady }: { onToken: (token: string) => void; onReady?: (ready: boolean) => void }) {
  const target = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey) return;
    const render = () => {
      if (target.current && window.turnstile && !widget.current) {
        widget.current = window.turnstile.render(target.current, { 
          sitekey: siteKey, 
          theme: "light", 
          callback: (token: string) => { console.log('turnstile token:', token); onToken(token); },
          "expired-callback": () => { console.log('turnstile expired'); onToken(""); }
        });
        setReady(true);
        onReady?.(true);
      }
    };
    const existing = document.querySelector("script[data-turnstile]");
    if (existing) { existing.addEventListener("load", render); render(); return () => existing.removeEventListener("load", render); }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.addEventListener("load", render);
    script.addEventListener("error", (e) => { console.error('Turnstile script failed to load', e); setReady(false); onReady?.(false); });
    document.head.appendChild(script);
    return () => { if (widget.current && window.turnstile) window.turnstile.remove(widget.current); onReady?.(false); };
  }, [siteKey, onToken]);
  if (!siteKey) return <p className="captcha-warning">Captcha is not configured yet. Add the Cloudflare Turnstile site key before deploying.</p>;
  return (
    <div className={`captcha ${ready?"has-widget":"no-widget"}`}>
      <div ref={target} className="captcha-target" />
    </div>
  );
}
