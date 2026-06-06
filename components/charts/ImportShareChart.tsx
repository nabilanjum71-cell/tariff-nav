'use client'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const COUNTRY_NAMES: Record<string, string> = {
  US:'United States',CN:'China',MX:'Mexico',CA:'Canada',DE:'Germany',
  JP:'Japan',GB:'UK',IN:'India',BR:'Brazil',KR:'South Korea',
}
const COLORS = ['#22c55e','#3b82f6','#f59e0b','#a855f7','#06b6d4','#ec4899','#84cc16','#f97316']

export default function ImportShareChart({ importers }: { importers: { country: string; share: number }[] }) {
  if (!importers?.length) return (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      Trade data loading...
    </div>
  )
  const data = {
    labels: importers.map(i => COUNTRY_NAMES[i.country] || i.country),
    datasets: [{ data: importers.map(i => i.share), backgroundColor: COLORS.slice(0, importers.length), borderColor: '#0a0f1e', borderWidth: 2 }]
  }
  return (
    <div style={{ height: 220 }}>
      <Pie data={data} options={{
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800 },
        plugins: {
          legend: { display: true, position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 8 } },
          tooltip: { backgroundColor: '#1e293b', bodyColor: '#94a3b8', titleColor: '#f1f5f9', callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
        }
      }} />
    </div>
  )
}
