// =============================================================================
// /accessibility — Accessibility statement page
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement | Barrett Henry, REALTOR®",
  description: "Our commitment to digital accessibility on nowtb.com.",
};

export default function AccessibilityPage() {
  return (
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary">
        <h1>Accessibility Statement</h1>
        <p className="text-muted">Last updated: May 2026</p>

        <h2>Our Commitment</h2>
        <p>
          Barrett Henry and The NOW Team are committed to ensuring digital
          accessibility for people of all abilities. We continually improve the
          user experience of nowtb.com to meet or exceed WCAG 2.1 AA standards.
        </p>

        <h2>Accessibility Features</h2>
        <ul>
          <li>Semantic HTML structure with proper heading hierarchy</li>
          <li>Keyboard navigable interface</li>
          <li>Sufficient color contrast ratios</li>
          <li>Alt text for meaningful images</li>
          <li>Responsive design for all screen sizes</li>
          <li>Skip navigation links</li>
        </ul>

        <h2>Feedback</h2>
        <p>
          If you encounter accessibility barriers on nowtb.com, please contact us:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:barrett@nowtb.com" className="text-accent">
              barrett@nowtb.com
            </a>
          </li>
          <li>
            Phone:{" "}
            <a href="tel:8137337907" className="text-accent">
              (813) 733-7907
            </a>
          </li>
        </ul>
        <p>
          We take accessibility feedback seriously and will make reasonable efforts
          to address any issues promptly.
        </p>
      </div>
    </section>
  );
}
