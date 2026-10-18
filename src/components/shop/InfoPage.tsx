import type { ReactNode } from "react";
import { PageHero } from "./bits";

export function InfoPage({ title, eyebrow, text, children }: { title: string; eyebrow?: string | undefined; text?: string | undefined; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} eyebrow={eyebrow} text={text} crumbs={[{ label: title }]} />
      <div className="container-x max-w-3xl space-y-6 py-12 leading-relaxed [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:text-muted-foreground">{children}</div>
    </>
  );
}
