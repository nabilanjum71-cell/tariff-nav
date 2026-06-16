import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + tagline */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-blue-400">Tariff</span>Nav
          </Link>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Look up US import duty rates, HS codes, and tariff data — fast,
            free, and always up to date.
          </p>
        </div>

        {/* Site links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link href="/chapters" className="hover:text-blue-400 transition">Chapters</Link></li>
            <li><Link href="/compare" className="hover:text-blue-400 transition">Compare</Link></li>
            <li><Link href="/calculator" className="hover:text-blue-400 transition">Calculator</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
          </ul>
        </div>

        {/* Legal links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Legal
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-blue-400 transition">Disclaimer</Link></li>
          </ul>
        </div>

        {/* Data sources */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Data Sources
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>USITC Harmonized Tariff Schedule</li>
            <li>World Trade Organization (WTO)</li>
            <li>UN Comtrade Database</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>© {year} TariffNav. All rights reserved.</p>
          <p>
            Duty rates are estimates for informational purposes only — always
            verify with a licensed customs broker before importing.
          </p>
        </div>
      </div>
    </footer>
  );
}

