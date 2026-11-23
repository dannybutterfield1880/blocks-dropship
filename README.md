# blocks-dropship

Storefront for **blocks** — building-brick sets, dropshipped.

Next.js 15 (App Router) · TypeScript · plain CSS · deploys to Vercel.

## Status

- [x] **Step 1 – Storefront**: home, shop (with builder-level filter), collection, product, basket, info pages. Dummy data in `lib/data.ts`.
- [x] **Step 2 – CJ product import**: search + import scripts, run from Termux, write `lib/catalog.json`
- [ ] Step 3 – Stripe Checkout
- [ ] Step 4 – Auto-fulfilment (Stripe webhook → supplier order → tracking email)
- [ ] Step 5 – Admin panel
- [ ] Step 6 – Launch (domain, legal pages, cookie banner, Vercel Pro / Netlify)

## Deploy

1. Push this repo to GitHub.
2. On vercel.com → **Add New → Project** → import `blocks-dropship` → Deploy. No settings needed.
3. Every push to `main` redeploys automatically.

## Adding real products (CJ Dropshipping)

One-off setup in Termux:

```bash
pkg install nodejs -y
export CJ_API_KEY="your key from CJ > My CJ > Authorization > API"
```

Then, from the `blocks-dropship` folder:

```bash
node scripts/search-cj.mjs "building blocks castle"   # find products + their PIDs
# add the PIDs you like to picks.json
node scripts/import-cj.mjs                           # pulls them into lib/catalog.json
git add . && git commit -m "Update products" && git push
```

Each entry in `picks.json`:

| Field | Required | Notes |
|---|---|---|
| `pid` | yes | CJ product ID from the search |
| `collection` | yes | `metro`, `orbit`, `keep`, `tidewater`, `main-street` or `bloom` |
| `name` | no | Your own product name (recommended — CJ names are messy) |
| `pieces`, `age` | no | Shown on the product card |
| `price` | no | Fixed price in pence (e.g. `3999`). Otherwise CJ cost × `MARKUP` (default 2.5) |
| `description` | no | Otherwise CJ's description is used |
| `bestseller` | no | `true` to show on the homepage |
| `vid` | no | Specific CJ variant; defaults to the first |

While `lib/catalog.json` is empty (`[]`) the site shows the dummy products.
Pricing ignores shipping cost for now — check CJ's shipping to the UK before setting `MARKUP`.

## Where things live

| What | File |
|---|---|
| Collections + dummy products | `lib/data.ts` |
| Products to import | `picks.json` |
| Imported products (generated) | `lib/catalog.json` |
| Colours, layout | `app/globals.css` |
| Logo | `components/Logo.tsx` |
| Announcement bar, nav | `components/Header.tsx` |
| Delivery / returns / contact text | `app/info/[page]/page.tsx` |

Placeholders like `[£X]` still need real values.
