// =============================================================================
// /dmca-notice — DMCA notice page
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Notice | Barrett Henry, REALTOR®",
  description: "DMCA copyright notice and takedown request process for nowtb.com.",
};

export default function DmcaNoticePage() {
  return (
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary">
        <h1>DMCA Notice</h1>
        <p>
          If you believe that content on nowtb.com infringes on your copyright, please
          send a written notice to our designated agent with the following information:
        </p>
        <ol>
          <li>A description of the copyrighted work you claim has been infringed</li>
          <li>The URL where the infringing material is located</li>
          <li>Your contact information (name, address, phone, email)</li>
          <li>A statement that you have a good faith belief the use is not authorized</li>
          <li>A statement under penalty of perjury that the information is accurate</li>
          <li>Your physical or electronic signature</li>
        </ol>
        <p>
          Send DMCA notices to:{" "}
          <a href="mailto:barrett@nowtb.com" className="text-accent">
            barrett@nowtb.com
          </a>
        </p>
      </div>
    </section>
  );
}
