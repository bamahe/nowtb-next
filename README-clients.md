# Private client comparison pages

These are the one-off home comparison packets you text or email to a buyer, for
example https://nowtb.com/clients/ellenburg-x7k2

Everything on the page comes out of a single JSON file. You never touch the page
code. Edit the JSON, push, done.

**The only file you edit:** `data/clients/<slug>.json`

For Ethan and Madison that is `data/clients/ellenburg-x7k2.json`

---

## To add or remove a home

1. Open `data/clients/<slug>.json`.
2. Inside `"homes": [ ... ]`, copy an existing home object top to bottom
   (from its `{` to its `}`) and paste it as a new entry. Remember the comma
   between entries.
3. Give it a new `id` that nothing else uses. Lowercase with hyphens, for
   example `"sage-canyon"`. The `id` is how the baseline home is pointed at, so
   it has to be unique.
4. Fill in the rest from the MLS sheet and PropWire.

### From the MLS sheet

| Field | What goes in it |
|---|---|
| `id` | Short unique slug, lowercase with hyphens |
| `name` | Street address, exactly as you want it shown |
| `community` | Subdivision in plain English. Add "(gated)" if it is |
| `mls` | MLS number |
| `price` | Current list price. Digits only, no `$` and no commas |
| `orig` | Original list price. Same as `price` if it never got cut. The page shows "was $X" only when they differ |
| `dom` | Days on market (CDOM) |
| `beds` | Number, for example `4` |
| `baths` | Number. Halves are fine, for example `2.5` |
| `sqft` | Heated area |
| `year` | Year built |
| `garage` | Number of spaces, for example `3`. Page renders it as "3 car" |
| `lot` | Acres as a number, for example `0.21`. Page renders it as "0.21 acre" |
| `stories` | `1` or `2` |
| `roof` | Free text. Include the age, it drives the insurance quote |
| `hoa` | HOA **per month** |
| `cdd` | Annual CDD fee. Use `0` when the community has none. The page divides by 12 |
| `ins` | Homeowners insurance **per month**. Use a real quote when you have one |
| `kwh_per_sf` | Monthly kilowatt hours per square foot for this house. Around `0.55` for one story, a little lower for a well sealed two story |
| `city` | Optional. Only makes the listing link read nicer, for example `"riverview"`. Leave it out and the link still works, the MLS number is what resolves it |

### From PropWire (the seller's existing loan), under `"loan"`

Set `"assumable": true` **only** for VA, FHA, or USDA loans. Conventional loans
are not assumable. When it is `true` you must also fill in `pi`, `mip` and
`bal`, or Option B will show "Not available" for that home. The sanity check
catches this.

| Field | What it means |
|---|---|
| `type` | `"VA"`, `"FHA"`, `"USDA"`, `"Conventional"` |
| `lender` | Servicer name. Note a change if there was one, for example `"Caliber Home Loans (now Newrez)"` |
| `recorded` | Year and month as `"2021-09"`. The page spells it out as "September 2021" |
| `orig` | Original loan amount |
| `bal` | Estimated balance remaining today. This drives the gap and the seller's equity |
| `rate` | A **WHOLE PERCENT**, so 3.01% is `3.01`. This one is not a decimal |
| `term` | Free text, for example `"30-yr"`, `"15-yr"`, `"ends 2051"` |
| `assumable` | `true` or `false` |
| `pi` | The seller's monthly principal and interest. Assumable only |
| `mip` | Monthly mortgage insurance. FHA has it, VA is `0`. Assumable only |
| `remaining` | Payments left on the loan. Assumable only. Shows as "300 payments left" |

> **Watch the rate convention.** `loan.rate` is a whole percent (`3.01`) but
> `settings.vaRate` and `settings.secondRate` are decimals (`0.06875`). That is
> how the file arrived and the code handles both. `loan.rate` is only ever
> displayed, never calculated with, so a mistake there shows up on the page but
> will not move any total.

### Commute and tour notes

| Field | What it means |
|---|---|
| `commute.toWork1` | `{ "miles": "22 mi", "time": "30 to 35 min" }`. Both are free text, so a range is fine. This is workplace **1** in settings |
| `commute.toWork2` | Same shape, workplace **2** |
| `commute.extraMilesOneWayVsBaseline` | One way miles added versus the baseline home. The baseline itself is `0` |
| `likes` | List of strings, shows as bullets under "Likes" |
| `cons` | List of strings, shows as bullets under "Watch outs" |
| `leverage` | One paragraph of plain text, shows under "Negotiating room" |

5. **To remove a home,** delete its whole `{ ... }` object and fix up the
   commas so there is no trailing comma before the closing `]`. If you delete
   the home that `baselineHomeId` points at, repoint it or no home will show
   "Baseline".

6. Run the sanity check so a typo does not reach the client:

   ```
   node scripts/check-client-compare.mjs
   ```

   It verifies the four known monthly totals, that every home has both commute
   legs, that no home is marked assumable without a `pi`, and that
   `baselineHomeId` matches a real home. When you change a listing on purpose
   the totals move, which is fine: open `scripts/check-client-compare.mjs` and
   update the `EXPECTED` table to the new correct numbers.

---

## The sliders

Every packet gets a "Run your own numbers" block with four sliders: cash down,
new VA rate, second loan rate, and the insurance estimate. Dragging one
recalculates all the homes at once and highlights the cheapest.

You do not configure this. It reads the same JSON and runs the same math as the
table, so the two can never disagree. The sliders start at whatever `settings`
says, and the Reset button puts them back.

Two behaviors worth knowing so you can explain them:

- **Cash down below 10% on an assumption.** A second lender will not go past
  `secondMaxCltv` of the price, so there is a hard floor on how little cash can
  work. Slide under it and the number holds at the floor with a note in red
  saying why, rather than quietly showing a payment nobody will fund.
- **Cash down above the gap.** Once the cash covers the whole gap, the second
  loan goes to zero and the payment stops dropping. That is correct, there is
  nothing left to borrow.

The links block at the bottom points at the four listings on nowtb.com plus the
VA loan, FHA loan, mortgage calculator, buyer guide, search and contact pages.
Listing links are built from the MLS number, so they keep working even if the
address slug is off.

## The settings block

`settings` applies to every home in the file. Rates and costs change, so
refresh these before you send a packet.

| Field | What it means |
|---|---|
| `vaRate` | Today's VA rate as a **decimal**, so 6.875% is `0.06875` |
| `secondRate` | Rate on the second loan as a **decimal** |
| `secondMaxCltv` | How far a second lender goes, counting the first loan. `0.9` is typical |
| `millage` | Total millage as a decimal, so 17.5 mills is `0.0175` |
| `homesteadExemption` | Dollars, for example `50722` |
| `assessRatio` | Assessed value as a share of price. `0.85` means 85% of price |
| `electricPerKwh` | Cost per kilowatt hour in dollars |
| `gasCostPerMile` | Dollars per mile |
| `avgMph` | Average speed in traffic, turns extra miles into extra hours |
| `workDays` | Work days per month |
| `drivers` | How many of them commute |
| `baselineHomeId` | Must match one home's `id` exactly. That home shows "Baseline" in the commute rows |
| `workplaces` | Exactly **two** names, in the same order as `toWork1` and `toWork2` |
| `rentNow` | Optional. What they pay today, free text. Shows in the header for contrast |

`client` is the name in the header line. `updated` is the date shown in the
header, written however you want it to read, for example `"October 4, 2026"`.

---

## New client

1. Copy an existing JSON to a new hard to guess slug. Keep it lowercase with
   hyphens and add a short random tail so nobody can guess it:

   ```
   cp data/clients/ellenburg-x7k2.json data/clients/martinez-q4m9.json
   ```

2. Edit `client`, `updated`, `settings`, and `homes`.
3. The page is live at `https://nowtb.com/clients/martinez-q4m9` as soon as it
   deploys. No route to add, no nav to update.

---

## Ship it

```
node scripts/check-client-compare.mjs
git add data/clients/
git commit -m "Update client comparison"
git push origin main
```

Vercel redeploys automatically. Give it a minute or two, then load the link
before you send it.

---

## Why these pages stay out of Google

Four layers, all already wired up. You do not need to do anything per client.

1. Page metadata sends `robots: noindex, nofollow`.
2. `vercel.json` sends an `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`
   header for `/clients/(.*)`.
3. `src/app/robots.ts` disallows `/clients/` for every crawler, including the
   AI bots.
4. `/clients/` is not in the sitemap and nothing on the site links to it. The
   site header, footer and mobile bar are hidden on these pages too, so a
   client cannot wander off into public pages mid comparison.

The link is still public to anyone who has it, which is why slugs get a random
tail. Treat it like an unlisted link, not a password.

## If it breaks, check this

- **Page 404s after you add a JSON file.** The slug in the URL has to match the
  filename exactly, minus `.json`. Also make sure the file is committed. Vercel
  builds from git, so an uncommitted file does not exist as far as the build is
  concerned.
- **Build fails with a JSON parse error.** Almost always a trailing comma or a
  missing comma between home objects. Paste the file into a JSON validator.
- **Option B says "Not available" on a home you expect it on.** `assumable` is
  not `true`, or `pi` is missing from the loan block.
- **Commute rows look shifted.** `workplaces` has to have exactly two entries,
  in the same order as `toWork1` and `toWork2`.
- **No home shows "Baseline".** `settings.baselineHomeId` does not match any
  home's `id`. The sanity check catches this.
- **A rate looks ten times too big or too small.** `loan.rate` is a whole
  percent, `settings.vaRate` and `settings.secondRate` are decimals. Easy to
  mix up.
- **A dollar figure looks wrong.** Check you did not put a `$` or a comma in a
  number field.
- **Build fails with "Cannot find module .next/server/app/[citySlug]/page.js".**
  Stale build cache, nothing to do with these pages. Run `rm -rf .next` and
  build again.
