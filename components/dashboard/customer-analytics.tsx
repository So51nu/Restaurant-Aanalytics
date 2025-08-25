"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Repeat, DollarSign } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"

interface CustomerAnalyticsProps {
  selectedRestaurant: string
  dateRange: string
}

export function CustomerAnalytics({ selectedRestaurant, dateRange }: CustomerAnalyticsProps) {
  const customerSegmentation = [
    { name: "New Customers", value: 35, count: 312, color: "hsl(var(--chart-1))" },
    { name: "Returning Customers", value: 45, count: 401, color: "hsl(var(--chart-2))" },
    { name: "VIP Customers", value: 20, count: 179, color: "hsl(var(--chart-3))" },
  ]

  const customerSpending = [
    { range: "$0-25", customers: 234, percentage: 26 },
    { range: "$26-50", customers: 312, percentage: 35 },
    { range: "$51-75", customers: 198, percentage: 22 },
    { range: "$76-100", customers: 89, percentage: 10 },
    { range: "$100+", customers: 59, percentage: 7 },
  ]

  const peakHours = [
    { hour: "6AM", newCustomers: 5, returningCustomers: 7 },
    { hour: "8AM", newCustomers: 12, returningCustomers: 33 },
    { hour: "10AM", newCustomers: 8, returningCustomers: 24 },
    { hour: "12PM", newCustomers: 25, returningCustomers: 64 },
    { hour: "2PM", newCustomers: 18, returningCustomers: 49 },
    { hour: "4PM", newCustomers: 15, returningCustomers: 28 },
    { hour: "6PM", newCustomers: 42, returningCustomers: 114 },
    { hour: "8PM", newCustomers: 38, returningCustomers: 96 },
    { hour: "10PM", newCustomers: 22, returningCustomers: 56 },
  ]

  const customerRetention = [
    { week: "Week 1", retention: 100 },
    { week: "Week 2", retention: 78 },
    { week: "Week 3", retention: 65 },
    { week: "Week 4", retention: 58 },
    { week: "Week 8", retention: 45 },
    { week: "Week 12", retention: 38 },
  ]

  const customerMetrics = {
    totalCustomers: 892,
    newCustomers: 312,
    returningCustomers: 401,
    vipCustomers: 179,
    avgCustomerValue: 67.5,
    customerRetentionRate: 68.5,
  }

  return (
    <div className="space-y-6">
      {/* Customer Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Active in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.newCustomers}</div>
            <p className="text-xs text-muted-foreground">First-time visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customerMetrics.avgCustomerValue}</div>
            <p className="text-xs text-muted-foreground">Per customer spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.customerRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">Customer return rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Breakdown of customer types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentation}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customerSegmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Spending Distribution</CardTitle>
            <CardDescription>How much customers typically spend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerSpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, "Customers"]} />
                <Bar dataKey="customers" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity by Hour</CardTitle>
            <CardDescription>New vs returning customers throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newCustomers" stackId="a" fill="hsl(var(--chart-1))" name="New Customers" />
                <Bar dataKey="returningCustomers" stackId="a" fill="hsl(var(--chart-2))" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Retention Curve</CardTitle>
            <CardDescription>How well you retain customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerRetention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, "Retention Rate"]} />
                <Line type="monotone" dataKey="retention" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        {customerSegmentation.map((segment) => (
          <Card key={segment.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {segment.name}
                <Badge variant="secondary">{segment.value}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{segment.count}</div>
              <p className="text-sm text-muted-foreground">
                {segment.name === "New Customers" && "First-time visitors to your restaurant"}
                {segment.name === "Returning Customers" && "Customers who have ordered before"}
                {segment.name === "VIP Customers" && "High-value repeat customers"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
