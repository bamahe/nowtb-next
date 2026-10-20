// =============================================================================
// /guides/florida-amendment-3-property-tax
//
// The Amendment 3 resource. This is a STATIC route rather than another entry in
// guides-content.json because it carries two interactive client components that
// a JSON driven template cannot render.
//
// It lives under /guides/ on purpose. New TOP LEVEL routes on nowtb.com 404 on
// the live domain until they are excluded from BOTH ":city" flatten redirects in
// next.config.mjs. "guides" is already in both lists, so this path is safe.
//
// Body copy is generated, not hand written here: see
// scripts/build-amendment3-content.py and src/data/amendment-3-*.ts. Edit the
// source markdown and regenerate rather than editing the data files, otherwise
// the next regeneration overwrites you.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import SavingsCalculator from "@/components/amendment3/SavingsCalculator";
import ResidencyChecker from "@/components/amendment3/ResidencyChecker";
import { AMD3_BLOCKS } from "@/data/amendment-3-content";
import { AMD3_FAQS } from "@/data/amendment-3-faqs";
import { BARRETT_TAKE } from "@/data/amendment-3-take";
import {
  articleSchema,
  faqSchema,
  breadcrumbSchema,
  SITE_URL,
} from "@/lib/schema";

const PAGE_PATH = "/guides/florida-amendment-3-property-tax";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// Bump dateModified whenever the content changes. The updater script does this
// automatically; if you edit by hand, change it by hand.
const PUBLISHED = "2026-10-20";
const MODIFIED = "2026-10-20";

const TITLE = "Florida Amendment 3: Property Tax Guide 2026";
const DESCRIPTION =
  "Florida Amendment 3 on the November 3, 2026 ballot: new homestead exemption, 5% cap, real savings math. See what it means for your home.";

export const metadata: Metadata = {
  // `absolute` bypasses the layout's " | Barrett Henry, REALTOR®" template.
  // That template is 26 characters, which would push this title well past the
  // 60 character budget and get it truncated in results.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
  },
};

/**
 * Barrett's Take renders after the both sides section, so a reader has seen
 * the neutral argument from each direction before they get his view.
 */
const TAKE_AFTER = "what-are-both-sides-saying-about-amendment-3";

/** Sections that get an interactive tool injected directly after them. */
const TOOL_AFTER: Record<string, "calculator" | "residency"> = {
  "what-would-amendment-3-actually-save-you": "calculator",
  "what-happens-if-you-were-not-a-florida-resident-on-december-31-2026":
    "residency",
};

const SOURCES = [
  {
    label: "Enrolled CS/HJR 1F, full text (Florida Senate)",
    url: "https://www.flsenate.gov/Session/Bill/2026F/1F/BillText/er/PDF",
  },
  {
    label: "Florida 2026 constitutional amendment booklet (Department of State)",
    url: "https://files.floridados.gov/media/711369/eng-2026-booklet-constitutional-amendpub-updated-20260903.pdf",
  },
  {
    label: "Pinellas County Property Appraiser, Amendment 3 FAQ",
    url: "https://www.pcpao.gov/amendment3",
  },
  {
    label: "Florida Department of Revenue, CPI homestead exemption adjustment",
    url: "https://floridarevenue.com/property/Documents/cpi_homestead_exemption.pdf",
  },
];

/**
 * Barrett's own view, visually separated from the neutral explainer so a
 * reader can tell at a glance where the reporting stops and the opinion
 * starts. Content comes from src/data/amendment-3-take.ts, which automation
 * is forbidden from editing.
 */
function BarrettTake() {
  return (
    <aside
      aria-label="Barrett's take"
      className="my-10 rounded-lg border-2 border-[#0c1829] bg-gray-50 p-6"
    >
      <p className="font-heading text-xl font-bold text-[#0c1829]">
        {BARRETT_TAKE.heading}
      </p>
      <div className="mt-3 space-y-3 font-body leading-relaxed text-dark">
        {BARRETT_TAKE.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
      <p className="mt-4 border-t border-gray-300 pt-3 text-xs italic text-gray-600">
        {BARRETT_TAKE.disclaimer}
      </p>
    </aside>
  );
}

export default function Amendment3Page() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Guides", url: `${SITE_URL}/guides` },
    { name: "Florida Amendment 3", url: PAGE_URL },
  ]);

  const article = articleSchema({
    headline:
      "Florida Amendment 3: What the 2026 Property Tax Amendment Actually Does",
    description: DESCRIPTION,
    url: PAGE_URL,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  });

  // Mark the measure up as a real entity. Nothing else in this search result
  // does it, and it gives answer engines something unambiguous to attach the
  // claims to.
  const legislation = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: "Florida Amendment 3 (2026)",
    legislationIdentifier: "CS/HJR 1F",
    legislationType: "Joint Resolution",
    legislationJurisdiction: "Florida, United States",
    legislationPassedBy: {
      "@type": "GovernmentOrganization",
      name: "Florida Legislature",
    },
    about:
      "Homestead exemption increase for non-school levies and a reduction of the annual non-homestead assessment cap from 10% to 5%.",
    url: PAGE_URL,
  };

  const election = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Florida General Election 2026",
    startDate: "2026-11-03",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Florida",
      address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" },
    },
    about: { "@type": "Legislation", name: "Florida Amendment 3 (2026)" },
  };

  const quickAnswer = AMD3_BLOCKS.find((b) => b.id === "quick-answer");
  const bodyBlocks = AMD3_BLOCKS.filter((b) => b.id !== "quick-answer");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(AMD3_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legislation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(election) }}
      />

      {/* Breadcrumb trail. Pairs with the BreadcrumbList schema above. */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-gray-600">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/guides" className="hover:underline">
            Guides
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span aria-current="page" className="font-semibold text-[#0c1829]">
            Florida Amendment 3
          </span>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-[#0c1829] py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Florida ballot, November 3, 2026
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Florida Amendment 3: What the 2026 Property Tax Amendment Actually
            Does
          </h1>
          <p className="mt-4 max-w-3xl text-gray-300">
            I read the enrolled resolution and the county property appraiser
            guidance so you do not have to. Below is what it changes, what it
            does not, what it would do to your own bill, and the argument on
            both sides.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-semibold text-[#0c1829] hover:bg-gray-100"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              (813) 733-7907
            </a>
            <Link
              href="/free-home-valuation"
              className="inline-flex items-center rounded border border-white px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              What is my home worth today?
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <main>
            {/* Quick answer. The .quick-answer class is what the site's
                speakable selectors target, so AI engines lift this block. */}
            {quickAnswer ? (
              <div
                className="quick-answer mb-8 rounded-lg border-l-4 border-[#0c1829] bg-gray-50 p-5
                  prose prose-lg font-body max-w-none text-dark
                  prose-headings:font-heading prose-headings:text-primary
                  prose-a:text-link prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: quickAnswer.html }}
              />
            ) : null}

            {bodyBlocks.map((block) => (
              <section key={block.id} id={block.id} className="scroll-mt-24">
                <div
                  className="blog-content prose prose-lg font-body max-w-none text-dark
                    prose-headings:font-heading prose-headings:text-primary
                    prose-a:text-link prose-a:no-underline hover:prose-a:underline
                    prose-p:leading-relaxed prose-table:text-sm"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
                {TOOL_AFTER[block.id] === "calculator" ? (
                  <SavingsCalculator />
                ) : null}
                {TOOL_AFTER[block.id] === "residency" ? (
                  <ResidencyChecker />
                ) : null}
                {block.id === TAKE_AFTER ? <BarrettTake /> : null}
              </section>
            ))}

            {/* Sources. On a page making dollar claims this is not decoration,
                it is the reason another site will cite this one. */}
            <section id="sources" className="mt-12 scroll-mt-24">
              <h2 className="font-heading text-2xl font-bold text-[#0c1829]">
                Sources
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {SOURCES.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      className="text-link hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                Ballot language verified {MODIFIED}. The ballot title and
                summary were rewritten by court order in August 2026, so any
                page quoting the original legislative title is quoting language
                that will not appear on a ballot.
              </p>
            </section>

            {/* Legal disclaimer */}
            <p className="mt-8 rounded bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
              This page explains a ballot measure. It is not legal, tax, or
              voting advice, and it does not tell you how to vote. Tax outcomes
              depend on your county, your millage, and your own circumstances.
              Confirm anything that matters with your county property appraiser
              or your CPA.
            </p>
          </main>

          {/* Sticky table of contents */}
          <aside className="mt-10 lg:mt-0">
            <nav
              aria-label="On this page"
              className="lg:sticky lg:top-24 rounded-lg border border-gray-200 bg-white p-5"
            >
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[#0c1829]">
                On this page
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {bodyBlocks.map((b) => (
                  <li key={b.id}>
                    <a
                      href={`#${b.id}`}
                      className="text-gray-600 hover:text-[#0c1829] hover:underline"
                    >
                      {b.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#sources"
                    className="text-gray-600 hover:text-[#0c1829] hover:underline"
                  >
                    Sources
                  </a>
                </li>
              </ul>

              <div className="mt-6 rounded bg-[#0c1829] p-4">
                <p className="font-heading text-sm font-bold text-white">
                  Buying or selling before the deadline?
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  The December 31, 2026 residency date has real consequences if
                  you are relocating.
                </p>
                <a
                  href="tel:+18137337907"
                  className="mt-3 block rounded bg-white px-3 py-2 text-center text-sm font-semibold text-[#0c1829] hover:bg-gray-100"
                >
                  Call (813) 733-7907
                </a>
              </div>
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}
