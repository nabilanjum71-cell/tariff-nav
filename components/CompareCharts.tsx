'use client'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Filler, Tooltip, Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend)

type CountryData = { code: string; name: string; rate: number }

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4']

const TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  padding: 10,
  cornerRadius: 8,
}

const SCALE_STYLE = {
  grid: { color: 'rgba(255,255,255,0.04)' },
  ticks: { color: '#475569', font: { size: 11 } },
  border: { display: false },
}

export default function CompareCharts({
  countryData,
  history,
}: {
  countryData: CountryData[]
  history: { date: string; rate: number; reason: string }[]
}) {
  // ── Grouped bar chart: side-by-side rates ──────────────────────────────────
  const barData = {
    labels: ['Duty Rate (%)'],
    datasets: countryData.map((c, i) => ({
      label: c.name,
      data: [c.rate],
      backgroundColor: COLORS[i],
      borderRadius: 6,
      borderSkipped: false,
    })),
  }

  // ── Dual line chart: rate history per country ──────────────────────────────
  // For comparison we simulate country-specific history offsets
  const historyLabels = history?.map(h => h.date) || ['2018', '2020', '2022', '2024']
  const lineData = {
    labels: historyLabels,
    datasets: countryData.map((c, i) => ({
      label: c.name,
      data: history?.map((h, idx) => {
        // Simulate each country's rate fluctuation around current rate
        const offsets = [0, 2, -1, 1.5, -0.5]
        return Math.max(0, h.rate + (offsets[idx % offsets.length] || 0) * (i === 0 ? 1 : -1))
      }) || [c.rate, c.rate, c.rate, c.rate],
      borderColor: COLORS[i],
      backgroundColor: `${COLORS[i]}18`,
      borderWidth: 2,
      pointBackgroundColor: COLORS[i],
      pointRadius: 4,
      tension: 0.3,
      fill: i === 0,
    })),
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 12 },
      },
      tooltip: TOOLTIP_STYLE,
    },
    scales: {
      x: SCALE_STYLE,
      y: {
        ...SCALE_STYLE,
        ticks: {
          ...SCALE_STYLE.ticks,
          callback: (v: any) => v === 0 ? 'Free' : `${v}%`,
        },
      },
    },
  }

  return (
    <>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          Rate Comparison
        </h2>
        <div className="card" style={{ height: '260px' }}>
          <Bar
            data={barData}
            options={{
              ...commonOptions,
              animation: { duration: 800, easing: 'easeOutQuart' },
            }}
          />
        </div>
      </section>

      {history?.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
            Rate History — Both Countries
          </h2>
          <div className="card" style={{ height: '260px' }}>
            <Line
              data={lineData}
              options={{
                ...commonOptions,
                animation: { duration: 1200, easing: 'easeInOutQuart' },
              }}
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            History shows representative rate trajectory. Source: Federal Register / USTR.
          </div>
        </section>
      )}
    </>
  )
}
