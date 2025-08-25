"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, PieChartIcon, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface SalesAnalyticsProps {
  selectedRestaurant: string
  dateRange: string
}

export function SalesAnalytics({ selectedRestaurant, dateRange }: SalesAnalyticsProps) {
  const salesTrendData = [
    { date: "2025-08-13", sales: 15200, orders: 89 },
    { date: "2025-08-14", sales: 18400, orders: 102 },
    { date: "2025-08-15", sales: 16800, orders: 95 },
    { date: "2025-08-16", sales: 21200, orders: 118 },
    { date: "2025-08-17", sales: 19600, orders: 108 },
    { date: "2025-08-18", sales: 17800, orders: 97 },
    { date: "2025-08-19", sales: 16430, orders: 92 },
  ]

  const restaurantComparison = [
    { name: "Downtown", revenue: 45200, orders: 312 },
    { name: "Mall", revenue: 38900, orders: 267 },
    { name: "Airport", revenue: 41300, orders: 289 },
  ]

  const categoryBreakdown = [
    { name: "Main Dishes", value: 45, color: "hsl(var(--chart-1))" },
    { name: "Appetizers", value: 20, color: "hsl(var(--chart-2))" },
    { name: "Beverages", value: 18, color: "hsl(var(--chart-3))" },
    { name: "Desserts", value: 12, color: "hsl(var(--chart-4))" },
    { name: "Others", value: 5, color: "hsl(var(--chart-5))" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">Sales & Orders Trend</CardTitle>
                <CardDescription className="text-orange-100">
                  Track sales performance and order volume over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#ea580c"
                />
                <YAxis
                  yAxisId="sales"
                  orientation="left"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#ea580c"
                />
                <YAxis yAxisId="orders" orientation="right" stroke="#dc2626" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === "sales" ? `$${value.toLocaleString()}` : value,
                    name === "sales" ? "Sales" : "Orders",
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff7ed",
                    border: "1px solid #f97316",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ fill: "#b91c1c", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <PieChartIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">Revenue by Category</CardTitle>
                <CardDescription className="text-purple-100">Breakdown of sales by menu categories</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Share"]}
                  contentStyle={{
                    backgroundColor: "#fdf4ff",
                    border: "1px solid #a855f7",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-white">Restaurant Performance Comparison</CardTitle>
              <CardDescription className="text-green-100">
                Compare revenue and orders across different locations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 relative">
          <div
            className="absolute inset-0 opacity-5 rounded-b-lg"
            style={{
              backgroundImage: `url('/restaurant-comparison-chart.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restaurantComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#10b981" opacity={0.2} />
              <XAxis dataKey="name" stroke="#047857" />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#047857"
              />
              <YAxis yAxisId="orders" orientation="right" stroke="#0d9488" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : value,
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
                contentStyle={{
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #10b981",
                  borderRadius: "8px",
                }}
              />
              <Bar yAxisId="revenue" dataKey="revenue" fill="url(#revenueBarGradient)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="orders" dataKey="orders" fill="url(#ordersBarGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="ordersBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
