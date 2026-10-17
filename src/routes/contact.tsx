import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shop/bits";
import { isEmail } from "@/lib/storage";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Us — Sholok" },
    { name: "description", content: "Get in touch with the Sholok team." },
    { property: "og:title", content: "Contact Sholok" },
    { property: "og:description", content: "Get in touch with the Sholok team." },
  ] }),
  component: Contact,
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const cls = "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm aria-[invalid=true]:border-destructive";
  return (
    <>
      <PageHero title="Contact us" text="Illustrative support details — this demo form doesn't send messages anywhere." crumbs={[{ label: "Contact Us" }]} />
      <div className="container-x grid max-w-5xl gap-10 py-12 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 text-sm">
          <p><strong>Hours (demo):</strong><br />Sat–Thu, 10am–8pm</p>
          <p><strong>Email (demo):</strong><br />hello@sholok.example</p>
          <p><strong>Studio (demo):</strong><br />Gulshan, Dhaka, Bangladesh</p>
        </div>
        {sent ? <p role="status" className="rounded-lg bg-accent p-6 text-accent-foreground">Thanks, {f.name}! In a live store we'd reply soon — this demo didn't send your message.</p> : (
          <form noValidate className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!f.name.trim()) x.name = "Please enter your name.";
            if (!isEmail(f.email)) x.email = "Please enter a valid email.";
            if (f.msg.trim().length < 10) x.msg = "Please write at least 10 characters.";
            setErr(x); if (!Object.keys(x).length) setSent(true);
          }}>
            {(["name", "email"] as const).map((k) => (
              <div key={k}><label htmlFor={`c-${k}`} className="mb-1 block text-sm font-semibold capitalize">{k}</label>
                <input id={`c-${k}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={cls} />
                {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}</div>
            ))}
            <div><label htmlFor="c-msg" className="mb-1 block text-sm font-semibold">Message</label>
              <textarea id="c-msg" rows={5} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} aria-invalid={!!err.msg} className={cls} />
              {err.msg && <p className="mt-1 text-xs text-destructive">{err.msg}</p>}</div>
            <button className="press rounded-full bg-ink px-8 py-3 text-sm font-semibold text-ink-foreground hover:bg-primary">Send message</button>
          </form>
        )}
      </div>
    </>
  );
}
