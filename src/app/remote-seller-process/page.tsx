// =============================================================================
// /remote-seller-process — Selling From Where You Are
// Public version of the Remote Seller Process packet handed to deployed and
// out-of-state sellers. Mirrors the PDF section for section: signing from
// overseas, the clean-out and vendor management, communication cadence, and
// the security deposit deadline.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Selling From Where You Are | Remote & Military Seller Process | Barrett Henry",
  description:
    "Sell your Tampa Bay home without setting foot in Florida. Power of attorney and remote online notarization, supervised clean-out and repairs, and a written update every Friday. Military Relocation Professional. Call (813) 733-7907.",
  alternates: {
    canonical: "/remote-seller-process/",
  },
  openGraph: {
    title: "Selling From Where You Are | Barrett Henry, REALTOR®",
    description:
      "A step by step process for deployed and out-of-state sellers in Tampa Bay.",
    type: "website",
  },
};

// --- Section 2: the clean-out sequence, in order ---
const cleanOutSteps = [
  {
    step: 1,
    title: "Documented walkthrough",
    description:
      "I walk the property and photograph and video everything before anything is touched or thrown away.",
  },
  {
    step: 2,
    title: "Secure the property",
    description:
      "Locks changed, keys accounted for, lockbox installed. Utilities stay on, because there are no photos, inspections, or appraisal without power and water.",
  },
  {
    step: 3,
    title: "Written quote before any spending",
    description:
      "Clean-out, haul-off, and repairs quoted in writing with photos of what the quote covers. You approve it before a dollar is spent.",
  },
  {
    step: 4,
    title: "Anything you want kept",
    description:
      "Tell me what matters and I will set it aside, photograph it, and arrange shipping or storage rather than guessing.",
  },
  {
    step: 5,
    title: "Make-ready and photography",
    description:
      "Work completed, after photos sent, then professional listing photos once it shows well.",
  },
];

// --- Section 3: communication commitments ---
const communication = [
  {
    title: "Email is primary",
    description:
      "Whoever you want copied is copied on everything, every time.",
  },
  {
    title: "A written update every Friday",
    description:
      "Whether or not anything dramatic happened, plus anything urgent immediately.",
  },
  {
    title: "Video calls whenever your schedule allows",
    description:
      "Tell me your window and I work around it. Odd hours are fine.",
  },
  {
    title: "Every document lives in one place",
    description:
      "So you are never hunting through an inbox for the version we are actually working from.",
  },
  {
    title: "Slow replies are expected",
    description:
      "You are deployed, or you are three time zones away. I will never read a delay as a lack of interest, and I will keep moving on the things that do not need you.",
  },
];

export default function RemoteSellerProcessPage() {
  return (
    <>
      <HeroSection
        title="Selling From Where You Are"
        label="REMOTE & MILITARY SELLERS"
        subtitle="You do not need to set foot in Florida for any part of this."
      />

      {/* ---- The short version ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl text-primary mb-4">
            The short version
          </h2>
          <p className="font-body text-dark leading-relaxed mb-4">
            You do not need to set foot in Florida for any part of this. I hold the
            Military Relocation Professional designation, and our RE/MAX Collective
            office at 11200 Seminole Blvd puts me minutes from most of the homes I
            list on this side of the bay.
          </p>
          <p className="font-body text-dark leading-relaxed">
            Below is exactly how the three things remote sellers always ask about
            actually work.
          </p>
        </div>
      </section>

      {/* ---- 1. Signing from overseas ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl mb-6">1. Signing from overseas</h2>
          <p className="font-body leading-relaxed mb-8">
            There are two routes. Which one fits depends on where you are and what
            your connectivity looks like.
          </p>

          <div className="mb-8">
            <h3 className="font-heading text-lg font-bold mb-2">
              Special Power of Attorney, the reliable route
            </h3>
            <p className="font-body leading-relaxed">
              A base legal assistance office can usually draft one at no cost. It
              should be specific to this sale and name someone stateside you trust.
              Florida requires two witnesses plus a notary, and a military notary is
              valid overseas without a state commission, so fellow servicemembers can
              witness.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-heading text-lg font-bold mb-2">
              Remote online notarization, the convenient route
            </h3>
            <p className="font-body leading-relaxed">
              Florida permits signing by live video. It is genuinely easier when it
              works. It can also fail for people who have been overseas a while,
              because the identity check pulls from US credit and public records, and
              some platforms block foreign IP addresses outright. I would rather have
              a power of attorney in hand as the backup than discover that three days
              before closing.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-accent bg-white/10 px-6 py-5 mb-8">
            <p className="font-heading font-bold mb-2">Handle it in one visit</p>
            <p className="font-body leading-relaxed">
              If you go to legal assistance, get everything notarized at the same
              appointment: the power of attorney, and a short name affidavit. If the
              county still shows title under a former name, your title company will
              likely want that affidavit. One trip instead of three scrambles across a
              time difference.
            </p>
          </div>

          <p className="font-body leading-relaxed">
            The listing agreement and the purchase contract are both e-signed. Nothing
            gets printed, mailed, or scanned.
          </p>
        </div>
      </section>

      {/* ---- 2. Clean-out, repairs, vendors ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl text-primary mb-6">
            2. The clean-out, repairs, and vendors
          </h2>
          <p className="font-body text-dark leading-relaxed mb-10">
            This starts the day the tenants hand over the keys, and it runs on a simple
            rule: I get quotes, you approve by email, you see photos before and after.
            You never wonder what is happening inside that house.
          </p>

          <ol className="space-y-6 mb-10">
            {cleanOutSteps.map((item) => (
              <li key={item.step} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-dark leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="font-body text-dark leading-relaxed">
            I schedule and supervise the vendors. If something goes sideways, that is
            my problem to solve, not a phone call you have to make from another time
            zone.
          </p>
        </div>
      </section>

      {/* ---- 3. Communication ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl mb-8">3. Communication</h2>
          <ul className="space-y-6">
            {communication.map((item) => (
              <li key={item.title}>
                <h3 className="font-heading text-lg font-bold mb-1">{item.title}</h3>
                <p className="font-body leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- The deadline that actually bites ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl text-primary mb-6">
            One item with a deadline
          </h2>
          <div className="rounded-lg border-2 border-primary bg-primary/5 px-6 py-6">
            <p className="font-heading font-bold text-primary mb-2">
              Security deposit, 30 days from move-out
            </p>
            <p className="font-body text-dark leading-relaxed">
              Florida gives you 30 days after the tenants vacate to send written notice
              by certified mail if you intend to claim any of their deposit. Miss that
              window and the full deposit goes back regardless. If you are mid-rotation
              when the keys come back, this is the one date I will chase you about.
            </p>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-xl mx-auto">
          <h2 className="heading-section text-2xl mb-3 text-center">
            Selling from a distance?
          </h2>
          <p className="font-body mb-8 text-center">
            Tell me where you are and what the timeline looks like. I will tell you
            exactly what you would need to sign and when.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source="/remote-seller-process/"
            type="contact"
            submitLabel="Start the conversation"
          />
          <p className="font-body text-sm mt-8 text-center">
            Or call{" "}
            <a href="tel:+18137337907" className="font-semibold underline">
              (813) 733-7907
            </a>
            . See also my{" "}
            <Link href="/sellers/" className="font-semibold underline">
              seller process
            </Link>{" "}
            and{" "}
            <Link href="/relocation/" className="font-semibold underline">
              relocation guide
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
