/**
 * Latest News feed. Server component, no client JS.
 *
 * Fed by src/data/amendment-3/news.json, which the pre-election updater
 * rewrites every two days. Renders nothing at all when the list is empty,
 * which is the correct behaviour: an empty feed is better than a stale one,
 * and far better than one the bot padded to look busy.
 *
 * Every item must carry a source name and URL. There is no code path that
 * renders an unattributed headline.
 *
 * If it breaks, check: news.json.checkedAt must advance on every run even
 * when there are zero new items. If it stops advancing, the updater is not
 * running and the "checked" line below will quietly go stale.
 */

import news from "@/data/amendment-3/news.json";

interface NewsItem {
  headline: string;
  blurb?: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00Z" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsFeed() {
  const items = (news.items ?? []) as NewsItem[];
  if (!items.length) return null;

  return (
    <section id="latest-news" className="my-10 scroll-mt-24">
      <h2 className="font-heading text-2xl font-bold text-[#0c1829]">
        Latest Amendment 3 news
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Coverage from across the spectrum. Last checked{" "}
        {formatDate(news.checkedAt)}.
      </p>

      <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <li key={item.sourceUrl} className="py-4">
            <a
              href={item.sourceUrl}
              className="font-heading font-semibold text-[#0c1829] hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.headline}
            </a>
            {item.blurb ? (
              <p className="mt-1 text-sm text-gray-700">{item.blurb}</p>
            ) : null}
            <p className="mt-1 text-xs text-gray-500">
              {item.sourceName} &middot; {formatDate(item.publishedAt)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500">
        Linking to a story is not an endorsement of it. These are listed so you
        can read the argument on both sides in the outlets making it.
      </p>
    </section>
  );
}
