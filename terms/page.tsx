export const metadata = {
  title: "Terms of Service | TariffNav",
  description: "TariffNav terms of service governing use of this website.",
};

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TariffNav, you agree to be bound by these
            Terms of Service. If you do not agree, please do not use this
            site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            TariffNav provides informational tools related to US import duty
            rates, HS/HTS codes, and tariff data, including a duty calculator,
            comparison tool, chapter and code reference pages, and a blog.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. No Professional Advice</h2>
          <p>
            Content on TariffNav, including AI-generated summaries, duty
            rate estimates, and calculator results, is provided for general
            informational purposes only and does not constitute legal,
            financial, or customs brokerage advice. Always consult a licensed
            customs broker or attorney before making import decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Accuracy of Information</h2>
          <p>
            While we strive to keep duty rates and HS code data accurate and
            current, tariff rates change frequently and may be affected by
            trade policy, country-specific agreements, or government action.
            We make no guarantee of accuracy and are not liable for decisions
            made based on information provided on this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. User Conduct</h2>
          <p>
            You agree not to misuse the site, including attempting to scrape
            data at scale, disrupt site functionality, or use the site for
            unlawful purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Limitation of Liability</h2>
          <p>
            TariffNav and its operators shall not be liable for any direct,
            indirect, incidental, or consequential damages arising from use
            of this site or reliance on its content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Changes to These Terms</h2>
          <p>
            We may revise these terms at any time. Continued use of the site
            after changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </main>
  );
}
