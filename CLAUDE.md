@AGENTS.md

# Next.js conventions

- Use the App Router (`src/app/`) with Server Components by default. Only add `"use client"` when a component actually needs interactivity (state, event handlers, browser APIs like `localStorage`) — see `src/app/product-insights/DuplicateItemRow.tsx`.
- Fetch data directly in an async Server Component (`await` a `src/services/*` function) instead of adding a client-side fetch or a new `/api` route. Only add an API route when the data genuinely needs to be reachable from client-side JS (see `src/app/api/proposals/route.ts` for that exception).
- For slow operations (e.g. AI calls), don't block the whole page on them: kick off the promise without `await`, render the rest of the page immediately, and stream the result in via `<Suspense>` around a child component that awaits it (see `src/app/product-insights/page.tsx` and `src/app/dashboard/page.tsx`).
- Keep API keys/secrets (`PROPOSALES_API_KEY`, `ANTHROPIC_API_KEY`) server-side only — never reference secret `process.env` vars from a `"use client"` file.
- Prefer Server Actions (`"use server"` in an `actions.ts` file) for mutations triggered from client components. Return a typed `{ ok: true } | { ok: false; error: string }` result rather than throwing — see `src/app/product-insights/actions.ts`.
- New pages: add `src/app/<route>/page.tsx` and register it in `src/components/Sidebar.tsx`'s `links` array so it's reachable from navigation.
- No UI kit is used in this repo — style with Tailwind utility classes matching the existing dark theme (`bg-black text-white`, `rounded-md border border-zinc-700`, `text-xs uppercase tracking-widest text-zinc-500` for section labels).
