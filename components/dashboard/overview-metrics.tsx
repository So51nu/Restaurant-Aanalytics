"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, Award, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface OverviewMetricsProps {
  selectedRestaurant: string
  dateRange: string
}

export function OverviewMetrics({ selectedRestaurant, dateRange }: OverviewMetricsProps) {
  // Mock data - in real app, this would come from API
  const kpiData = {
    totalRevenue: 125430,
    totalOrders: 1247,
    avgOrderValue: 42.5,
    activeCustomers: 892,
    revenueChange: 12.5,
    ordersChange: 8.3,
    aovChange: -2.1,
    customersChange: 15.2,
  }

  const revenueData = [
    { date: "2025-08-13", revenue: 15200 },
    { date: "2025-08-14", revenue: 18400 },
    { date: "2025-08-15", revenue: 16800 },
    { date: "2025-08-16", revenue: 21200 },
    { date: "2025-08-17", revenue: 19600 },
    { date: "2025-08-18", revenue: 17800 },
    { date: "2025-08-19", revenue: 16430 },
  ]

  const ordersByHour = [
    { hour: "6AM", orders: 12 },
    { hour: "8AM", orders: 45 },
    { hour: "10AM", orders: 32 },
    { hour: "12PM", orders: 89 },
    { hour: "2PM", orders: 67 },
    { hour: "4PM", orders: 43 },
    { hour: "6PM", orders: 156 },
    { hour: "8PM", orders: 134 },
    { hour: "10PM", orders: 78 },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden card-hover border-orange-100 bg-gradient-to-br from-white to-orange-50">
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10"
            style={{
              backgroundImage: `url('/money-coins-icon.png')`,
              backgroundSize: "cover",
            }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">${kpiData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{kpiData.revenueChange}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-orange-100 bg-gradient-to-br from-white to-blue-50">
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10"
            style={{
              backgroundImage: `url('/shopping-cart-food.png')`,
              backgroundSize: "cover",
            }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{kpiData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{kpiData.ordersChange}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-orange-100 bg-gradient-to-br from-white to-amber-50">
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10"
            style={{
              backgroundImage: `url('/placeholder-ccbd7.png')`,
              backgroundSize: "cover",
            }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Avg Order Value</CardTitle>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">${kpiData.avgOrderValue}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-red-600 font-medium">{kpiData.aovChange}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-orange-100 bg-gradient-to-br from-white to-purple-50">
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10"
            style={{
              backgroundImage: `url('/happy-restaurant-customers.png')`,
              backgroundSize: "cover",
            }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Customers</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{kpiData.activeCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{kpiData.customersChange}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
                <CardDescription className="text-orange-100">Daily revenue for the selected period</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#ea580c"
                />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} stroke="#ea580c" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#fff7ed",
                    border: "1px solid #f97316",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#revenueGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">Orders by Hour</CardTitle>
                <CardDescription className="text-blue-100">Peak ordering times throughout the day</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.2} />
                <XAxis dataKey="hour" stroke="#1e40af" />
                <YAxis stroke="#1e40af" />
                <Tooltip
                  formatter={(value: number) => [value, "Orders"]}
                  contentStyle={{
                    backgroundColor: "#eff6ff",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="url(#ordersGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
