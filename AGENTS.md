<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Frontend-only demo: no backend, server functions or external APIs; all state lives in `src/store/shop.tsx` (React context + defensive localStorage via `src/lib/storage.ts`). Why: the brief forbids backend/API use.
- Catalog data has a single source of truth in `src/data/*`; prices/totals only via `src/lib/pricing.ts` (covered by `pricing.test.ts`). Why: keeps prices consistent across pages.
- Product photos are local files in `public/images/p/{category}-{n}.webp` (n=6 is the category cover, `d` suffix = detail crop). Why: remote placeholder image hosts proved unreliable.
