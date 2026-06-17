export const metadata = {
  title: "Privacy Policy | TariffNav",
  description: "TariffNav privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
          <p>
            TariffNav collects minimal personal information. If you sign up
            for tariff alerts, we store your email address and the HS codes
            you choose to watch. We do not require an account to use the
            duty calculator, compare tool, or to browse HS code and chapter
            pages.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Information</h2>
          <p>
            Email addresses collected through the alerts feature are used
            solely to notify you of changes to duty rates for the HS codes
            you selected. We do not sell, rent, or share your email address
            with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Cookies and Analytics</h2>
          <p>
            We may use cookies and analytics tools (such as Google Analytics)
            to understand how visitors use the site and improve its content
            and performance. These tools may collect anonymized usage data,
            including pages visited and time spent on the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Third-Party Services</h2>
          <p>
            TariffNav uses third-party services including Supabase (database
            hosting), Vercel (site hosting), and may display embedded YouTube
            videos. These services have their own privacy policies governing
            data they may collect.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Data Security</h2>
          <p>
            We take reasonable measures to protect data stored on our
            platform, but no method of transmission or storage is completely
            secure. Use of the site is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Your Rights</h2>
          <p>
            You may request removal of your email and alert data at any time
            by contacting us. We will remove your information from our
            subscriber database upon request.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Continued
            use of the site after changes constitutes acceptance of the
            updated policy.
          </p>
        </section>
      </div>
    </main>
  );
}