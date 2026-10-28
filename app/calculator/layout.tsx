import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Import Duty Calculator USA — Calculate HS Code Duty Cost',
  description: 'Free US import duty calculator: enter any HS code and shipment value to calculate your exact duty cost, including duty rates for 164 countries, Section 301 China tariffs and USMCA savings.',
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
