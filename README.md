# blocks-dropship

Storefront for **blocks** — building-brick sets, dropshipped.

Next.js 15 (App Router) · TypeScript · plain CSS · deploys to Vercel.

## Status

- [x] **Step 1 – Storefront**: home, shop (with builder-level filter), collection, product, basket, info pages. Dummy data in `lib/data.ts`.
- [ ] Step 2 – Product import from supplier API (CJ / AliExpress) into Supabase
- [ ] Step 3 – Stripe Checkout
- [ ] Step 4 – Auto-fulfilment (Stripe webhook → supplier order → tracking email)
- [ ] Step 5 – Admin panel
- [ ] Step 6 – Launch (domain, legal pages, cookie banner, Vercel Pro / Netlify)

## Deploy

1. Push this repo to GitHub.
2. On vercel.com → **Add New → Project** → import `blocks-dropship` → Deploy. No settings needed.
3. Every push to `main` redeploys automatically.

## Where things live

| What | File |
|---|---|
| Products, collections, prices (dummy) | `lib/data.ts` |
| Colours, layout | `app/globals.css` |
| Logo | `components/Logo.tsx` |
| Announcement bar, nav | `components/Header.tsx` |
| Delivery / returns / contact text | `app/info/[page]/page.tsx` |

Placeholders like `[£X]` still need real values.
