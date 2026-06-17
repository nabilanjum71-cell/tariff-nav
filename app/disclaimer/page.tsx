export const metadata = {
  title: "Disclaimer | TariffNav",
  description: "Important disclaimer regarding duty rate data and AI-generated content on TariffNav.",
};

export default function Disclaimer() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white mb-2">Disclaimer</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Not Customs or Legal Advice</h2>
          <p>
            TariffNav is an independent informational resource and is not
            affiliated with, endorsed by, or operated on behalf of US
            Customs and Border Protection (CBP), the United States
            International Trade Commission (USITC), or any government
            agency. Information on this site does not constitute legal,
            customs brokerage, or financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">AI-Generated Content</h2>
          <p>
            Many product summaries and blog articles on this site are
            generated using artificial intelligence (AI). While we aim for
            accuracy, AI-generated content may occasionally contain errors,
            outdated information, or oversimplifications. Always verify
            duty rates and classification details against the official
            Harmonized Tariff Schedule before making import decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Duty Rate Accuracy</h2>
          <p>
            Duty rates, trade agreement eligibility, and classification data
            displayed on TariffNav are sourced from the USITC Harmonized
            Tariff Schedule, WTO data, and UN Comtrade, and may not reflect
            real-time changes, country-specific exclusions, antidumping or
            countervailing duties, or Section 301/232 actions in effect at
            the time of your import. Rates over 100% have been capped to 0
            in our database pending manual review and may not reflect the
            true applicable rate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">No Liability</h2>
          <p>
            TariffNav and its operators are not responsible for any loss,
            penalty, customs delay, or financial damage resulting from
            reliance on information provided on this site. Always confirm
            classification and duty rates with a licensed customs broker or
            directly with CBP before importing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Third-Party Links and Media</h2>
          <p>
            This site may include embedded YouTube videos and links to
            third-party services (such as freight forwarders or customs
            brokers). We do not control and are not responsible for the
            content or accuracy of third-party material.
          </p>
        </section>
      </div>
    </main>
  );
}
