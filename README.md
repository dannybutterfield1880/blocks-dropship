# blocks-dropship

Storefront for **blocks** — building-brick sets, dropshipped.

Next.js 15 (App Router) · TypeScript · plain CSS · deploys to Vercel.

## Status

- [x] **Step 1 – Storefront**: home, shop (with builder-level filter), collection, product, basket, info pages. Dummy data in `lib/data.ts`.
- [x] **Step 2 – CJ product import**: search + import scripts, run from Termux, write `lib/catalog.json`
- [x] **Step 3 – Stripe Checkout**: basket → Stripe hosted checkout (UK address + phone), webhook logs paid orders
- [x] **Step 4 – Auto-fulfilment**: paid order → CJ order (cheapest UK shipping) → daily tracking check → tracking email
- [x] **Step 5 – Admin panel**: `/admin` — orders + CJ/tracking status, hide/rename/reprice products
- [x] **Step 6 – Launch prep**: admin Settings (seller details, delivery, returns), terms / privacy / returns / delivery / contact pages, sitemap, robots, favicon

## Deploy

1. Push this repo to GitHub.
2. On vercel.com → **Add New → Project** → import `blocks-dropship` → Deploy. No settings needed.
3. Every push to `main` redeploys automatically.

## Payments (Stripe)

Set these in Vercel → Project → **Settings → Environment Variables**, then redeploy:

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key (`sk_test_…` while testing) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the webhook below |

Webhook: Stripe → Developers → Webhooks → **Add destination** → endpoint
`https://YOUR-SITE.vercel.app/api/stripe-webhook`, event `checkout.session.completed`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

Test with card `4242 4242 4242 4242`, any future date, any CVC. Paid orders show in the Stripe dashboard and as `NEW ORDER` lines in Vercel → Logs.

## Auto-fulfilment (CJ + tracking emails)

When Stripe confirms a payment, the webhook places the same order with CJ (UK address, cheapest shipping method) and tags the Stripe payment with the CJ order id. Every morning at 9am UTC, `/api/cron/tracking` checks those orders with CJ and emails the customer once a tracking number exists.

Extra environment variables in Vercel:

| Variable | Value |
|---|---|
| `CJ_API_KEY` | Same key used by the import scripts |
| `CJ_PAY_TYPE` | `3` (default) = order is created, you confirm + pay in the CJ dashboard. `2` = paid automatically from your CJ balance |
| `CJ_LOGISTIC` | Optional. Force one shipping method, e.g. `CJPacket Ordinary` |
| `RESEND_API_KEY` | From resend.com (free tier) |
| `EMAIL_FROM` | e.g. `blocks <orders@yourdomain.co.uk>` — needs a domain verified in Resend |
| `CRON_SECRET` | Any long random string (stops strangers triggering the tracking check) |

Order status lives on each payment in Stripe → Payments → (payment) → Metadata:
`cj_status` = `ordered` → `shipped` (with `tracking`), or `manual` if it couldn't be sent to CJ (product with no CJ variant, or `CJ_API_KEY` missing). Search Vercel → Logs for `MANUAL ORDER NEEDED` or `CJ ORDER FAILED`.

## Go-live checklist

1. **Admin → Settings**: fill in legal name, email and business address (shows on terms, privacy, contact and footer). Check delivery fee, delivery times and returns window.
2. **Products**: import real sets from CJ, set names/prices in Admin → Products, then hide or delete anything dummy.
3. **Domain**: buy one (e.g. `.co.uk`), add it in Vercel → Project → Settings → Domains, then set `SITE_URL` to `https://yourdomain.co.uk`.
4. **Hosting plan**: move to Vercel Pro (Hobby is non-commercial only) — or Netlify — before the first real sale.
5. **Emails**: verify the domain in Resend, set `EMAIL_FROM` to an address on it.
6. **Stripe live mode**: activate the account, swap `STRIPE_SECRET_KEY` to the live `sk_live_…` key, create a new live webhook and update `STRIPE_WEBHOOK_SECRET`. Turn on Stripe's customer receipt emails for successful payments (in Stripe settings) so customers get an order confirmation.
7. **CJ**: top up the CJ balance; once a few orders have gone through fine, consider `CJ_PAY_TYPE=2` for hands-off ordering.
8. **Test order** with a real card for a cheap set, then refund it in Stripe.
9. **Check**: product safety marking (UKCA/CE) and test reports from CJ for each set; VAT rules for goods shipped from abroad (ask an accountant).

## Admin panel (`/admin`)

- **Orders**: last 50 paid orders with customer, items, total and status (Sent to CJ / Shipped / Needs manual order), plus a "Check tracking now" button.
- **Settings**: seller details, delivery fee / free-delivery threshold / times, returns window. Saved to `lib/settings.json`.
- **Products**: change name and price, hide a product, mark bestsellers. Saving commits `lib/overrides.json` to GitHub and Vercel redeploys (~1 min). Re-importing from CJ keeps these edits.

Environment variables in Vercel:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | A long password for `/admin` |
| `GITHUB_TOKEN` | GitHub → Settings → Developer settings → **Fine-grained tokens** → only `blocks-dropship`, permission **Contents: Read and write** |
| `GITHUB_REPO` | Optional, default `dannybutterfield1880/blocks-dropship` |

Because the admin panel commits to GitHub, always `git pull` before pushing from Termux (the `blocks` command does this for you).

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
git add . && git commit -m "Update products" && git pull --no-rebase && git push
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
