"use client"

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Legend,
} from "recharts"

interface Props {
  pctApoyo: number
  pctNoApoyo: number
  pctNecesitaInfo: number
  porComuna: { comuna: string; total: number }[]
  porFecha: { fecha: string; total: number; apoyo: number }[]
}

const COLORS = {
  apoyo: "#16a34a",
  noApoyo: "#dc2626",
  necesitaInfo: "#d97706",
}

export default function ResultadosCharts({ pctApoyo, pctNoApoyo, pctNecesitaInfo, porComuna, porFecha }: Props) {
  const pieData = [
    { name: "Apoya", value: pctApoyo, color: COLORS.apoyo },
    { name: "No apoya", value: pctNoApoyo, color: COLORS.noApoyo },
    { name: "Necesita info", value: pctNecesitaInfo, color: COLORS.necesitaInfo },
  ]

  const fechaData = porFecha.map(f => ({
    ...f,
    label: new Date(f.fecha).toLocaleDateString("es-CL", { month: "short" }),
    "No apoya": f.total - f.apoyo,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pie chart */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-6">Distribución de posiciones</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 flex-1">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participation by commune */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-6">Top 10 comunas</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={porComuna} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="comuna" type="category" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Bar dataKey="total" fill="#16a34a" radius={[0, 4, 4, 0]} name="Participaciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline */}
      <div className="card p-6 lg:col-span-2">
        <h2 className="font-bold text-gray-900 mb-6">Evolución por mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={fechaData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#6b7280" strokeWidth={2} name="Total" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="apoyo" stroke={COLORS.apoyo} strokeWidth={2} name="Apoya" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="No apoya" stroke={COLORS.noApoyo} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
