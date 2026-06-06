'use client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  LineElement, PointElement, Filler, Tooltip
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip)

export default function RateHistoryChart({ history }: { history: { date: string; rate: number; reason: string }[] }) {
  if (!history?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      No history data
    </div>
  )
  const data = {
    labels: history.map(h => h.date),
    datasets: [{
      data: history.map(h => h.rate),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#22c55e',
      pointRadius: 4,
      tension: 0.3,
      fill: true,
    }]
  }
  return (
    <div style={{ height: 220 }}>
      <Line data={data} options={{
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 1200 },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', bodyColor: '#94a3b8', titleColor: '#f1f5f9' } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } }, border: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 }, callback: (v: any) => `${v}%` }, border: { display: false } }
        }
      }} />
    </div>
  )
}
