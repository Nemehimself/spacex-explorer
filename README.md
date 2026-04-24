# 🚀 SpaceX Explorer

A production-grade frontend application built with **Next.js 15**, **TypeScript**, and **React Query** to explore SpaceX launches, rockets, and launchpads using the public [SpaceX REST API v4](https://github.com/r-spacex/SpaceX-API).

---

## Live Demo

> Add your deployed URL here (e.g. Vercel)

---

## How to Run

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/spacex-explorer.git
cd spacex-explorer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Type Check

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

---

## Project Structure
```
spacex-explorer/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── globals.css
│   ├── launches/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── favorites/
│   │   └── page.tsx
│   └── charts/
│       └── page.tsx
│
├── components/
│   ├── common/
│   │   ├── Skeleton.tsx
│   │   ├── ErrorState.tsx
│   │   └── Spinner.tsx
│   ├── launches/
│   │   ├── LaunchCard.tsx
│   │   ├── LaunchFilters.tsx
│   │   └── LaunchVirtualList.tsx
│   ├── detail/
│   │   ├── RocketCard.tsx
│   │   ├── LaunchpadCard.tsx
│   │   └── ImageGallery.tsx
│   └── charts/
│       ├── LaunchesPerYearChart.tsx
│       └── SuccessRateChart.tsx
│
├── hooks/
│   ├── launches/
│   │   ├── useLaunch.ts
│   │   ├── useInfiniteLaunches.ts
│   │   └── useChartData.ts
│   ├── rockets/
│   │   └── useRocket.ts
│   ├── launchpads/
│   │   └── useLaunchpad.ts
│   └── favorites/
│       └── useFavorites.ts
│
├── lib/
│   ├── api/
│   │   ├── spacexClient.ts
│   │   ├── launches.ts
│   │   ├── rockets.ts
│   │   └── launchpads.ts
│   ├── queryClient.ts
│   └── constants.ts
│
├── types/
│   ├── launch.ts
│   ├── rocket.ts
│   ├── launchpad.ts
│   └── pagination.ts
│
├── utils/
│   ├── date.ts
│   ├── storage.ts
│   └── retry.ts
│
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Architecture Decisions

### App Router vs Pages Router

I chose **App Router** (Next.js 13+) for the following reasons:

- **React Server Components**: Launch detail pages can fetch data server-side and stream to the client, reducing the JavaScript bundle sent to the browser.
- **Nested layouts**: The shared nav/footer lives in `layout.tsx` once and is never re-rendered on navigation.
- **Future-proof**: Pages Router is in maintenance mode; App Router is the direction Next.js is investing in.

**Tradeoff**: App Router is more complex - you must carefully separate `"use client"` boundaries. All data-fetching hooks (React Query) must live in client components, so I isolated them in a `providers.tsx` file wrapping the app.

---

### React Query vs SWR vs Custom Fetchers

I chose **TanStack Query (React Query v5)** because:

| Feature | React Query | SWR | Custom |
|---|---|---|---|
| Infinite scroll | `useInfiniteQuery` built-in | Manual | Manual |
| Request deduplication | ✓ automatic | ✓ automatic | ✗ manual |
| Background refetch | ✓ configurable | ✓ configurable | ✗ manual |
| Devtools | ✓ excellent | basic | ✗ none |
| Parallel queries | `useQueries` built-in | Manual | Manual |
| Cache granularity | per-key TTL | per-key TTL | you build it |

The deciding factor was `useInfiniteQuery` - it handles page accumulation, `hasNextPage`, and `fetchNextPage` out of the box, which maps directly to the `/launches/query` pagination API.

---

## SpaceX API Usage

### Pagination Strategy

All launch list queries use `POST /launches/query` with server-side pagination:

```typescript
// Each page request sends:
{
  query: {
    upcoming: false,          // filter: past launches only
    name: { $regex: "star", $options: "i" },  // search
    date_utc: { $gte: "2020-01-01" },          // date range
  },
  options: {
    sort: { date_utc: -1 },   // newest first
    limit: 12,                 // page size
    page: 2,                   // cursor
  }
}
```

The API returns a paginated response with `hasNextPage`, `nextPage`, and `totalDocs`. React Query's `useInfiniteQuery` uses `nextPage` as the cursor for the next fetch.

**Why server-side pagination?**  
SpaceX has 200+ launches. Fetching all of them client-side would be ~500KB of JSON on every load. Server-side pagination means each request is ~15KB.

### Chart Data Strategy

Charts need the full dataset to calculate per-year aggregates. Instead of paginating, I make one request with `limit: 9999` and a `select` projection:

```typescript
options: {
  select: { name: 1, date_utc: 1, success: 1, upcoming: 1 },
  limit: 9999,
}
```

This returns only the 5 fields charts need (~40KB), not full launch objects. Chart data is cached for 1 hour (`staleTime: 3_600_000`) since historical data never changes.

### Retry / Backoff

The Axios interceptor in `spacexClient.ts` retries on `429` (rate limit) and `5xx` (server error) with exponential backoff:

- Attempt 1 → wait 1s
- Attempt 2 → wait 2s  
- Attempt 3 → wait 4s

---

## Performance Considerations

### List Virtualisation

The launch list uses `@tanstack/react-virtual`. With 200+ launches loaded via infinite scroll, rendering all DOM nodes simultaneously would cause severe jank. Virtualisation keeps the rendered node count at ~10 regardless of list length.

### Memoisation

- `LaunchCard` is wrapped in `React.memo()` — prevents re-render when sibling cards change.
- `onToggleFavorite` and `handleFilterChange` are wrapped in `useCallback` — stable references prevent child re-renders.
- React Query's `select` option in `useChartData` transforms raw data once and memoises the result.

### Image Optimisation

All images use Next.js `<Image>` with explicit `width` and `height`, which:
- Prevents layout shift (CLS)
- Serves WebP where supported
- Lazy-loads images below the fold

### Caching Strategy

| Data | staleTime | Why |
|---|---|---|
| Launch list | 5 minutes | Launches don't change often |
| Launch detail | 5 minutes | Mostly static once launched |
| Chart data | 1 hour | Historical data is immutable |
| Rocket/Launchpad | 30 minutes | Almost never changes |

---

## Accessibility

- **Skip link**: "Skip to main content" appears on focus — keyboard users can bypass the nav.
- **Semantic HTML**: `<article>`, `<header>`, `<nav>`, `<section>`, `<main>`, `<footer>`, `<dl>/<dt>/<dd>` for metadata.
- **ARIA**: `role="feed"` on virtualised list, `role="alert"` on error states, `aria-busy` on loading states, `aria-pressed` on toggle buttons, `aria-label` on icon-only buttons, `aria-modal` on lightbox.
- **Focus management**: All interactive elements have visible `focus-visible` rings. Lightbox traps focus correctly.
- **Keyboard navigation**: Every button, link, and form control is reachable via Tab. Filter buttons use `aria-pressed` state.
- **Reduced motion**: All animations are wrapped in `@media (prefers-reduced-motion: reduce)` and disabled for users who request it.
- **Screen readers**: Images have descriptive `alt` text. Skeleton loaders have `role="status"` and `aria-label="Loading..."`.
- **Colour contrast**: All text meets WCAG AA contrast ratios against the dark background.

---

## Tradeoffs and What I'd Do Next

### With More Time

1. **SSR/SSG for launch detail**: Pre-render popular launch pages at build time with `generateStaticParams`. The tradeoff is build time vs TTFB — for a public site, the performance win is worth it.

2. **Service worker + offline**: Cache the last-fetched launch list and favorites in the Cache API so the app works offline. The tradeoff is complexity - you need to handle cache invalidation carefully.

3. **Launch comparison**: A `/compare?a=ID&b=ID` route showing two launches side-by-side. The shareable URL makes it easy to share comparisons. Would need a new layout component and URL state management.

4. **E2E tests**: Playwright tests for the filter flow, favorites persistence, and infinite scroll trigger.

5. **Bundle analysis**: Run `@next/bundle-analyzer` to identify heavy dependencies and code-split aggressively.

6. **React Suspense boundaries**: Replace the manual `isLoading` checks with `<Suspense>` + React Server Components for a cleaner data-fetching pattern.

---

## Known Limitations / TODOs

- **No offline support** - the app requires network access. A service worker would fix this.
- **No SSR for launch list** - the list is fully client-rendered. Adding `generateStaticParams` or ISR would improve first-paint performance.
- **No launch comparison feature** - the bonus side-by-side comparison page is not implemented.
- **Flickr images sometimes missing** - many launches have no Flickr photos. The gallery section is hidden when empty, but a placeholder could be added.
- **Date input styling** - the native `<input type="date">` appearance varies across browsers. A custom date picker would give more consistent UX.
- **No unit tests** - component and hook tests with Vitest + React Testing Library are a high priority next step.
- **Virtualiser height is fixed** - `calc(100vh - 320px)` works well on desktop but could be improved on very short viewports.
