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
3. Fill it in from the MLS sheet and PropWire. Field by field:

   **From the MLS sheet**

   | Field | Where it comes from |
   |---|---|
   | `name` | Street address, exactly as you want it shown |
   | `mls` | MLS number |
   | `community` | Subdivision, in plain English |
   | `city` | City, state, zip |
   | `price` | Current list price, digits only, no `$` and no commas |
   | `origPrice` | Original list price. Same as `price` if it never got cut. The page shows "was $X" only when they differ |
   | `daysOnMarket` | CDOM |
   | `bedsBaths` | Free text, for example `"4 bed / 3 bath"` |
   | `sqft` | Heated area |
   | `yearBuilt` | Year built |
   | `stories` | `1` or `2` |
   | `garage` | Free text, for example `"3 car oversized attached"` |
   | `lot` | Free text, for example `"0.20 acre (8,920 sq ft)"` |
   | `roof` | Free text. Include the age, it drives the insurance quote |
   | `cdd` | Annual CDD fee. Use `0` when the community has none. The page divides by 12 |
   | `hoa` | HOA **per month** |
   | `ins` | Homeowners insurance **per month**. Use a real quote when you have one |

   **From PropWire (the seller's existing loan)**

   Set `"assumable": true` **only** for VA, FHA, or USDA loans. Conventional
   loans are not assumable. When it is true you must also fill in `pi`, `mip`,
   `bal`, and `rate`, or Option B will not render.

   | Field | What it means |
   |---|---|
   | `assumable` | `true` or `false` |
   | `type` | `"VA"`, `"FHA"`, `"USDA"`, `"Conventional"` |
   | `lender` | Servicer name, or a note telling yourself to confirm it |
   | `recorded` | When the mortgage was recorded, for example `"September 2021"` |
   | `term` | Usually `"30 year"` |
   | `rate` | A **decimal**, so 2.75% is `0.0275` |
   | `bal` | Estimated balance remaining today |
   | `pi` | The seller's monthly principal and interest |
   | `mip` | Monthly mortgage insurance. FHA has it, VA does not, so VA is `0` |

   **Commute and tour notes**

   | Field | What it means |
   |---|---|
   | `commute` | One `{ "minutes": X, "miles": Y }` per workplace, in the **same order** as `settings.workplaces` |
   | `extraMilesOneWayVsBaseline` | One way miles added versus the baseline home. The baseline itself is `0` |
   | `likes` | List of strings, shows as bullets |
   | `watchOuts` | List of strings, shows as bullets |
   | `negotiatingRoom` | One paragraph of plain text |

4. **To remove a home,** delete its whole `{ ... }` object and fix up the
   commas so there is no trailing comma before the closing `]`.

5. Run the sanity check so a typo does not reach the client:

   ```
   node scripts/check-client-compare.mjs
   ```

   It verifies the four known monthly totals and that every home has one
   commute entry per workplace. When you change a listing on purpose the totals
   move, which is fine: open `scripts/check-client-compare.mjs` and update the
   `EXPECTED` table to the new correct numbers.

---

## The settings block

`settings` applies to every home in the file. Rates and costs change, so
refresh these before you send a packet.

| Field | What it means |
|---|---|
| `vaRate` | Today's VA rate as a decimal, so 6.75% is `0.0675` |
| `assessRatio` | Assessed value as a share of price. `0.8` means 80% of price |
| `homesteadExemption` | Dollars, usually `50000` |
| `millage` | Total millage as a decimal, so 19.1 mills is `0.0191` |
| `kwh_per_sf` | Monthly kilowatt hours per square foot |
| `electricPerKwh` | Cost per kilowatt hour in dollars |
| `secondMaxCltv` | How far a second lender goes, counting the first loan. `0.9` is typical |
| `secondRate` | Rate on the second loan as a decimal |
| `drivers` | How many of them commute |
| `workDays` | Work days per month |
| `avgMph` | Average speed in traffic, turns extra miles into extra hours |
| `gasCostPerMile` | Dollars per mile |
| `baselineHome` | Must match one home's `name` **exactly**. That home shows "Baseline" in the commute rows |
| `workplaces` | One `{ "name": ..., "who": ... }` per workplace |

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
4. `/clients/` is not in the sitemap and nothing on the site links to it.

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
  not `true`, or `pi` / `bal` / `rate` are missing.
- **Commute rows look shifted.** `commute` has to have one entry per workplace,
  in the same order as `settings.workplaces`. The sanity check catches this.
- **No home shows "Baseline".** `settings.baselineHome` does not exactly match
  any home's `name`. The sanity check catches this too.
- **A dollar figure looks wrong.** Check you did not put a `$` or a comma in a
  number field, and that `rate` is a decimal and not a whole percent.
