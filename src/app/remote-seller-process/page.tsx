// =============================================================================
// /remote-seller-process: Selling From Where You Are
// Public version of the Remote Seller Process packet handed to deployed and
// out-of-state sellers. Mirrors the PDF section for section: signing from
// overseas, the clean-out and vendor management, communication cadence, and
// the security deposit deadline.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import SourcesSection from "@/components/ui/SourcesSection";

export const metadata: Metadata = {
  title: "Selling From Where You Are | Remote Seller Process",
  description:
    "Sell your Tampa Bay home without setting foot in Florida. Power of attorney, remote notarization, supervised repairs. Call (813) 733-7907.",
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
            Military Relocation Professional designation, and our REMAX Collective
            office at 11200 Seminole Blvd puts me minutes from most of the homes I
            list on this side of the bay.
          </p>
          <p className="font-body text-dark leading-relaxed">
            Below is exactly how the things remote sellers always ask about actually
            work, including the one detail about remote notarization that catches
            people who are genuinely overseas.
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
            <p className="font-body leading-relaxed mb-4">
              A base legal assistance office can usually draft one at no cost. It
              should be specific to this sale and name someone stateside you trust.
            </p>
            <p className="font-body leading-relaxed mb-4">
              The execution requirements are statutory, not optional. Under Fla. Stat.
              709.2105, a power of attorney must be signed by the principal and by two
              subscribing witnesses, and acknowledged by the principal before a notary
              public. The agent you name has to be a natural person at least 18 years
              old, or a financial institution with trust powers and a place of business
              in Florida. Your witnesses cannot be the agent.
            </p>
            <p className="font-body leading-relaxed">
              Two more things that matter in practice. A power of attorney relied on to
              affect title to real property generally needs to be recorded, so the
              title company will want the original or a certified copy, not a scan. And
              a military power of attorney executed under 10 U.S.C. 1044b is exempt
              from state form requirements and has the same effect as one prepared
              under Florida law, which is why the legal assistance route works even
              when you are nowhere near a Florida notary.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-heading text-lg font-bold mb-2">
              Remote online notarization, the convenient route
            </h3>
            <p className="font-body leading-relaxed mb-4">
              Florida permits signing by live two-way audio-video under Fla. Stat.
              117.209 and 117.265. The notary records the session. It is genuinely
              easier when it works.
            </p>
            <p className="font-body leading-relaxed mb-4">
              <strong>Here is the detail that catches deployed sellers.</strong> You,
              the signer, can be overseas. But under Fla. Stat. 117.285, a remote
              witness must verbally confirm that he or she is a resident of and
              physically located within the United States or a United States territory
              at the time of witnessing. So your witnesses have to be stateside, even
              though you do not. If you were planning to have two people in your unit
              witness by video from overseas, that does not work. Line up US-based
              witnesses in advance, or use the power of attorney route.
            </p>
            <p className="font-body leading-relaxed">
              Remote notarization can also fail for people who have been overseas a
              while, because the identity check pulls from US credit and public
              records, and some platforms block foreign IP addresses outright. I would
              rather have a power of attorney in hand as the backup than discover that
              three days before closing.
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

      {/* ---- Selling with a tenant in place vs vacant ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl text-primary mb-6">
            Sell with the tenant in place, or wait until it is vacant?
          </h2>
          <p className="font-body text-dark leading-relaxed mb-8">
            If the house is rented, this is the first real decision, and it is usually
            driven by your lease end date rather than by preference.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse font-body text-sm">
              <thead>
                <tr className="bg-primary text-white text-left">
                  <th className="px-3 py-2.5"></th>
                  <th className="px-3 py-2.5">Tenant in place</th>
                  <th className="px-3 py-2.5">Vacant</th>
                </tr>
              </thead>
              <tbody className="text-dark">
                <tr className="bg-light">
                  <td className="px-3 py-2.5 font-semibold">Buyer pool</td>
                  <td className="px-3 py-2.5">
                    Mostly investors. Owner-occupant buyers generally cannot wait out
                    a lease
                  </td>
                  <td className="px-3 py-2.5">Full market, which is where your price comes from</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-semibold">Showings</td>
                  <td className="px-3 py-2.5">
                    Require tenant cooperation and notice. A tenant with no reason to
                    help is a real constraint
                  </td>
                  <td className="px-3 py-2.5">Lockbox and open access</td>
                </tr>
                <tr className="bg-light">
                  <td className="px-3 py-2.5 font-semibold">Condition and photos</td>
                  <td className="px-3 py-2.5">
                    You market the house as the tenant keeps it
                  </td>
                  <td className="px-3 py-2.5">Make-ready and professional photography are possible</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-semibold">Carrying cost</td>
                  <td className="px-3 py-2.5">Rent keeps coming in while it is listed</td>
                  <td className="px-3 py-2.5">You carry the payment, utilities and lawn</td>
                </tr>
                <tr className="bg-light">
                  <td className="px-3 py-2.5 font-semibold">Insurance</td>
                  <td className="px-3 py-2.5">Normal landlord policy</td>
                  <td className="px-3 py-2.5">
                    Most policies restrict coverage once a home has been vacant 30 to
                    60 days. You need a vacancy endorsement
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-semibold">Lease transfers</td>
                  <td className="px-3 py-2.5">
                    The lease survives the sale. The buyer takes the tenant and the
                    deposit obligation
                  </td>
                  <td className="px-3 py-2.5">Nothing transfers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-body text-dark leading-relaxed mb-4">
            My take: if the lease ends within about 90 days of when you want to list,
            wait for vacant and market to the full buyer pool. If it runs longer than
            that, selling with the tenant in place to an investor is usually the better
            trade than breaking a lease or paying a tenant to leave.
          </p>
          <p className="font-body text-dark leading-relaxed">
            One thing I will not do is pressure a tenant. A tenant who feels
            steamrolled becomes a showing problem, and that costs you more than the
            schedule ever would.
          </p>
        </div>
      </section>

      {/* ---- The deadline that actually bites ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl mb-6">
            The security deposit deadline
          </h2>
          <div className="rounded-lg border-l-4 border-accent bg-white/10 px-6 py-6 mb-8">
            <p className="font-heading font-bold mb-2">
              15 days if you claim nothing, 30 days if you do
            </p>
            <p className="font-body leading-relaxed">
              Under Fla. Stat. 83.49, if you do not intend to impose a claim on the
              deposit, you must return it, with interest where required, within 15 days
              after the rental agreement terminates. If you do intend to claim part of
              it, you must give written notice within 30 days, sent by certified mail to
              the tenant&apos;s last known mailing address or by email. The notice has to
              state the amount claimed, the reason, and that the tenant has 15 days to
              object in writing.
            </p>
          </div>
          <p className="font-body leading-relaxed mb-4">
            Miss the 30-day notice and the consequence is specific: you forfeit the
            right to impose a claim on the deposit and may not seek a setoff against
            it. You can still sue for damages, but only after returning the deposit.
            That is a bad trade.
          </p>
          <p className="font-body leading-relaxed">
            If you are mid-rotation when the keys come back, this is the one date I
            will chase you about. For how to document a claim so it actually holds up,
            including the difference between normal wear and real damage, see{" "}
            <a
              href="https://vivipm.com/blog/security-deposit-smoke-damage-florida"
              className="font-semibold underline"
              rel="noopener"
            >
              can a Florida landlord keep a security deposit for smoke damage
            </a>{" "}
            on ViVi Property Management.
          </p>
        </div>
      </section>

      {/* ---- Who does what ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-2xl text-primary mb-6">
            What you have to do, and what I handle
          </h2>
          <p className="font-body text-dark leading-relaxed mb-8">
            The short answer is that you make decisions and sign things. Everything
            else is mine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-primary bg-primary/5 p-6">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">
                Only you can do these
              </h3>
              <ul className="font-body text-dark text-sm space-y-2 list-disc pl-5 leading-relaxed">
                <li>Sign the listing agreement and the contract, or execute the power of attorney</li>
                <li>Approve the price and any price change</li>
                <li>Approve repair spending before it happens</li>
                <li>Decide what personal property you want kept and shipped</li>
                <li>Make the deposit claim decision inside the statutory window</li>
                <li>Provide payoff and HOA account information</li>
                <li>Sign closing documents, or your attorney-in-fact does</li>
              </ul>
            </div>
            <div className="border border-border bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">
                I handle these
              </h3>
              <ul className="font-body text-dark text-sm space-y-2 list-disc pl-5 leading-relaxed">
                <li>Pricing analysis and the comparable sales behind it</li>
                <li>Coordinating the power of attorney with the title company early</li>
                <li>Access, lockbox, key control and re-keying</li>
                <li>Scheduling and supervising every vendor, with photos</li>
                <li>Tenant communication and showing coordination</li>
                <li>Utilities staying on through inspections and appraisal</li>
                <li>Inspection and appraisal attendance</li>
                <li>Negotiation, deadlines and the written Friday update</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Sources ---- */}
      <SourcesSection
        sources={[
          {
            name: "Fla. Stat. 709.2105, Qualifications of agent; execution of power of attorney",
            used: "The requirement that a power of attorney be signed by the principal and two subscribing witnesses and acknowledged before a notary, and who may serve as agent.",
            href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0709/Sections/0709.2105.html",
          },
          {
            name: "Fla. Stat. 117.209, 117.265 and 117.285, Remote online notarization",
            used: "Appearance by two-way audio-video, the recording requirement, and the rule that a remote witness must be physically located within the United States or a US territory at the time of witnessing.",
            href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0117/Sections/0117.285.html",
          },
          {
            name: "10 U.S.C. 1044b, Military powers of attorney",
            used: "That a military power of attorney is exempt from state form requirements and has the same effect as one prepared under state law.",
          },
          {
            name: "Fla. Stat. 83.49, Deposit money or advance rent; duty of landlord and tenant",
            used: "The 15-day return deadline with no claim, the 30-day written notice deadline with a claim, the certified mail or email delivery method, the tenant's 15-day objection window, and forfeiture of the right to claim if notice is late.",
            href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.49.html",
          },
        ]}
      />

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
