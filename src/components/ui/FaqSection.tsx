// =============================================================================
// FaqSection : renders a question and answer list in the site card style
// Server component. Pair it with faqSchema() from @/lib/schema so the markup
// and the FAQPage structured data always match.
// =============================================================================

export interface Faq {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  /** Section heading, written as a plain question people search */
  heading: string;
  faqs: Faq[];
}

export default function FaqSection({ heading, faqs }: FaqSectionProps) {
  return (
    <section className="section-light py-16">
      <div className="container-wide max-w-3xl mx-auto">
        <h2 className="heading-section text-display-sm text-primary text-center mb-12">
          {heading}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border border-border p-6">
              <h3 className="heading-section text-lg text-primary mb-3">
                {faq.question}
              </h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
