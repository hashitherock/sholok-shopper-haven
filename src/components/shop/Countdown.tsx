import { useEffect, useState } from "react";
import { flashSaleEnd } from "@/data/site";
import { cn } from "@/lib/utils";

/** Remaining ms until the configured sale end; null until mounted (avoids SSR mismatch). */
export function useCountdown(end?: number) {
  const [target] = useState(() => end ?? flashSaleEnd());
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);
  return left;
}

export function CountdownTimer({ end, tone = "dark" }: { end?: number; tone?: "dark" | "light" }) {
  const left = useCountdown(end);
  if (left === 0) return <p role="status" className="rounded-md bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">This flash sale has ended — new deals start soon.</p>;
  const s = Math.floor((left ?? 0) / 1000);
  const parts = [["Hrs", Math.floor(s / 3600)], ["Min", Math.floor((s % 3600) / 60)], ["Sec", s % 60]] as const;
  return (
    <div role="timer" aria-label="Time left in flash sale" className="flex items-center gap-2">
      {parts.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={cn("min-w-14 rounded-md px-2 py-1.5 text-center tabular-nums", tone === "dark" ? "bg-ink text-ink-foreground" : "bg-card text-ink")}>
            <div className="text-xl font-bold leading-none">{left === null ? "--" : String(v).padStart(2, "0")}</div>
            <div className="mt-1 text-[0.6rem] uppercase tracking-widest opacity-70">{label}</div>
          </div>
          {i < 2 && <span aria-hidden className="font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}
