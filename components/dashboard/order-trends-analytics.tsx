"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarIcon, TrendingUp, DollarSign, ShoppingBag, Clock, AlertCircle } from "lucide-react"
import { format, isWithinInterval, parseISO } from "date-fns"
import type { Restaurant, Order } from "@/lib/mock-data"

interface OrderTrendsAnalyticsProps {
  selectedRestaurant: Restaurant | null
  orders: Order[]
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export function OrderTrendsAnalytics({
  selectedRestaurant,
  orders,
  dateRange,
  onDateRangeChange,
}: OrderTrendsAnalyticsProps) {
  const analyticsData = useMemo(() => {
    if (!selectedRestaurant) return null

    const filteredOrders = orders.filter((order) => {
      const orderDate = parseISO(order.date)
      return (
        order.restaurantId === selectedRestaurant.id &&
        isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
      )
    })

    // Group orders by date
    const dailyData = filteredOrders.reduce(
      (acc, order) => {
        const date = order.date
        if (!acc[date]) {
          acc[date] = {
            date,
            orders: [],
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
          }
        }
        acc[date].orders.push(order)
        acc[date].totalOrders += 1
        acc[date].totalRevenue += order.amount
        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate AOV and format data for charts
    const chartData = Object.values(dailyData).map((day: any) => ({
      date: format(parseISO(day.date), "MMM dd"),
      fullDate: day.date,
      orders: day.totalOrders,
      revenue: Math.round(day.totalRevenue),
      aov: Math.round((day.totalRevenue / day.totalOrders) * 100) / 100,
    }))

    // Calculate peak hours
    const hourlyData = filteredOrders.reduce(
      (acc, order) => {
        const hour = order.hour
        if (!acc[hour]) {
          acc[hour] = { hour, orders: 0, revenue: 0 }
        }
        acc[hour].orders += 1
        acc[hour].revenue += order.amount
        return acc
      },
      {} as Record<number, any>,
    )

    const peakHoursData = Object.values(hourlyData)
      .map((hour: any) => ({
        hour: `${hour.hour}:00`,
        hourNum: hour.hour,
        orders: hour.orders,
        revenue: Math.round(hour.revenue),
      }))
      .sort((a, b) => a.hourNum - b.hourNum)

    // Calculate summary metrics
    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const peakHour = peakHoursData.reduce((max, hour) => (hour.orders > max.orders ? hour : max), peakHoursData[0])

    return {
      chartData: chartData.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()),
      peakHoursData,
      summary: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        peakHour: peakHour?.hour || "N/A",
        peakHourOrders: peakHour?.orders || 0,
      },
    }
  }, [selectedRestaurant, orders, dateRange])

  if (!selectedRestaurant) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Restaurant Selected</h3>
          <p className="text-muted-foreground">Please select a restaurant from the listings to view order trends</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Restaurant Info and Date Range */}
      <Card className="gradient-bg text-white">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-serif">Order Trends Analytics</CardTitle>
              <p className="opacity-90">
                {selectedRestaurant.name} • {selectedRestaurant.cuisine} • {selectedRestaurant.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        onDateRangeChange({ from: range.from, to: range.to })
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.summary.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-secondary">${analyticsData.summary.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold text-accent">${analyticsData.summary.averageOrderValue}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Hour</p>
                  <p className="text-2xl font-bold text-chart-3">{analyticsData.summary.peakHour}</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.summary.peakHourOrders} orders</p>
                </div>
                <Clock className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Orders Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Daily Orders Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--color-orders)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-orders)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Daily Revenue Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                Daily Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Average Order Value Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Average Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  aov: {
                    label: "AOV",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="aov"
                      stroke="var(--color-aov)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-aov)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Peak Hours Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-chart-4" />
                Peak Order Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
