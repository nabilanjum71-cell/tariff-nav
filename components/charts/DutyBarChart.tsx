'use client'
import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler)

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', CN: 'China', MX: 'Mexico', CA: 'Canada',
  DE: 'Germany', JP: 'Japan', GB: 'UK', IN: 'India',
  BR: 'Brazil', KR: 'South Korea', AU: 'Australia', SG: 'Singapore',
  FR: 'France', IT: 'Italy', VN: 'Vietnam', TH: 'Thailand',
}

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 10,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#475569', font: { size: 11 } },
      border: { display: false }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#475569', font: { size: 11 } },
      border: { display: false }
    }
  }
}

// ── BAR CHART: Duty rates by country ────────────────────────────────────────
export function DutyBarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  const labels = entries.map(([code]) => COUNTRY_NAMES[code] || code)
  const values = entries.map(([, rate]) => rate)

  const backgroundColors = values.map(v =>
    v === 0 ? 'rgba(34,197,94,0.7)' :
    v < 5   ? 'rgba(134,239,172,0.7)' :
    v < 15  ? 'rgba(251,191,36,0.7)' :
              'rgba(239,68,68,0.7)'
  )

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
      borderRadius: 5,
      borderSkipped: false,
    }]
  }

  return (
    <div className="chart-container" style={{ height: '280px' }}>
      <Bar data={chartData} options={{
        ...chartDefaults,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: ctx => ctx.raw === 0 ? ' Duty Free' : ` ${ctx.raw}% duty rate`
            }
          }
        },
        scales: {
          ...chartDefaults.scales,
          y: {
            ...chartDefaults.scales.y,
            ticks: { ...chartDefaults.scales.y.ticks, callback: (v: any) => v === 0 ? 'Free' : `${v}%` }
          }
        }
      }} />
    </div>
  )
}

// ── LINE CHART: Rate history ─────────────────────────────────────────────────
export function RateHistoryChart({ history }: { history: { date: string; rate: number; reason: string }[] }) {
  if (!history?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      No history available
    </div>
  )

  const chartData = {
    labels: history.map(h => h.date),
    datasets: [{
      data: history.map(h => h.rate),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#22c55e',
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.3,
      fill: true,
    }]
  }

  return (
    <div className="chart-container" style={{ height: '220px' }}>
      <Line data={chartData} options={{
        ...chartDefaults,
        animation: {
          duration: 1200,
          easing: 'easeInOutQuart',
        },
        scales: {
          ...chartDefaults.scales,
          y: {
            ...chartDefaults.scales.y,
            ticks: { ...chartDefaults.scales.y.ticks, callback: (v: any) => `${v}%` }
          }
        }
      }} />
    </div>
  )
}

// ── PIE CHART: Import share ──────────────────────────────────────────────────
export function ImportShareChart({ importers }: { importers: { country: string; share: number }[] }) {
  if (!importers?.length) return (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      Trade data loading...
    </div>
  )

  const COLORS = ['#22c55e','#3b82f6','#f59e0b','#a855f7','#06b6d4','#ec4899','#84cc16','#f97316']

  const chartData = {
    labels: importers.map(i => COUNTRY_NAMES[i.country] || i.country),
    datasets: [{
      data: importers.map(i => i.share),
      backgroundColor: COLORS.slice(0, importers.length),
      borderColor: '#0a0f1e',
      borderWidth: 2,
    }]
  }

  return (
    <div className="chart-container" style={{ height: '220px', position: 'relative' }}>
      <Pie data={chartData} options={{
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 800, easing: 'easeOutBounce' },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 8 }
          },
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }} />
    </div>
  )
}
