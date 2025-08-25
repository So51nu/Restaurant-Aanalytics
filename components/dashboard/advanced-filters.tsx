"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Filter,
  CalendarIcon,
  DollarSign,
  Clock,
  Store,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react"
import { format, isWithinInterval, parseISO } from "date-fns"
import type { Restaurant, Order } from "@/lib/mock-data"

interface AdvancedFiltersProps {
  filters: {
    amountRange: { min: number; max: number }
    hourRange: { min: number; max: number }
    cuisine: string
    location: string
  }
  onFiltersChange: (filters: any) => void
  restaurants: Restaurant[]
  orders: Order[]
}

export function AdvancedFilters({ filters, onFiltersChange, restaurants, orders }: AdvancedFiltersProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([])

  const cuisines = useMemo(() => Array.from(new Set(restaurants.map((r) => r.cuisine))), [restaurants])
  const locations = useMemo(() => Array.from(new Set(restaurants.map((r) => r.location))), [restaurants])

  const filteredData = useMemo(() => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = parseISO(order.date)
      const matchesDateRange = isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
      const matchesAmount = order.amount >= filters.amountRange.min && order.amount <= filters.amountRange.max
      const matchesHour = order.hour >= filters.hourRange.min && order.hour <= filters.hourRange.max

      const restaurant = restaurants.find((r) => r.id === order.restaurantId)
      const matchesCuisine = !filters.cuisine || restaurant?.cuisine === filters.cuisine
      const matchesLocation = !filters.location || restaurant?.location === filters.location
      const matchesRestaurant = selectedRestaurants.length === 0 || selectedRestaurants.includes(order.restaurantId)

      return matchesDateRange && matchesAmount && matchesHour && matchesCuisine && matchesLocation && matchesRestaurant
    })

    // Calculate analytics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0)
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Group by date for trend analysis
    const dailyData = filteredOrders.reduce(
      (acc, order) => {
        const date = order.date
        if (!acc[date]) {
          acc[date] = { date, orders: 0, revenue: 0 }
        }
        acc[date].orders += 1
        acc[date].revenue += order.amount
        return acc
      },
      {} as Record<string, any>,
    )

    const trendData = Object.values(dailyData)
      .map((day: any) => ({
        date: format(parseISO(day.date), "MMM dd"),
        orders: day.orders,
        revenue: Math.round(day.revenue),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group by hour for hourly analysis
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

    const hourlyChartData = Object.values(hourlyData)
      .map((hour: any) => ({
        hour: `${hour.hour}:00`,
        orders: hour.orders,
        revenue: Math.round(hour.revenue),
      }))
      .sort((a, b) => Number.parseInt(a.hour) - Number.parseInt(b.hour))

    // Restaurant performance
    const restaurantData = restaurants
      .map((restaurant) => {
        const restaurantOrders = filteredOrders.filter((order) => order.restaurantId === restaurant.id)
        const revenue = restaurantOrders.reduce((sum, order) => sum + order.amount, 0)
        return {
          name: restaurant.name,
          orders: restaurantOrders.length,
          revenue: Math.round(revenue),
        }
      })
      .filter((r) => r.orders > 0)
      .sort((a, b) => b.revenue - a.revenue)

    return {
      filteredOrders,
      summary: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        uniqueRestaurants: new Set(filteredOrders.map((o) => o.restaurantId)).size,
      },
      trendData,
      hourlyChartData,
      restaurantData,
    }
  }, [orders, restaurants, dateRange, filters, selectedRestaurants])

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      amountRange: { min: 0, max: 200 },
      hourRange: { min: 0, max: 23 },
      cuisine: "",
      location: "",
    })
    setSelectedRestaurants([])
    setDateRange({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    })
  }

  const exportData = () => {
    const csvContent = [
      ["Date", "Restaurant", "Amount", "Hour", "Customer"],
      ...filteredData.filteredOrders.map((order) => {
        const restaurant = restaurants.find((r) => r.id === order.restaurantId)
        return [order.date, restaurant?.name || "", order.amount, order.hour, order.customerName]
      }),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `filtered-orders-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-bg text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-serif flex items-center gap-2">
            <Filter className="h-6 w-6" />
            Advanced Filtering System
          </CardTitle>
          <p className="opacity-90">Apply comprehensive filters to analyze order data with precision</p>
        </CardHeader>
      </Card>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Date & Time Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to })
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Hour Range: {filters.hourRange.min}:00 - {filters.hourRange.max}:00
              </Label>
              <Slider
                value={[filters.hourRange.min, filters.hourRange.max]}
                onValueChange={([min, max]) => handleFilterChange("hourRange", { min, max })}
                max={23}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>12:00 AM</span>
                <span>11:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-secondary" />
              Amount & Location Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Amount Range: ${filters.amountRange.min} - ${filters.amountRange.max}
              </Label>
              <Slider
                value={[filters.amountRange.min, filters.amountRange.max]}
                onValueChange={([min, max]) => handleFilterChange("amountRange", { min, max })}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$200</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Cuisine</Label>
                <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange("cuisine", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Location</Label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Selection */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-accent" />
            Restaurant Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurants.map((restaurant) => (
              <Badge
                key={restaurant.id}
                variant={selectedRestaurants.includes(restaurant.id) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setSelectedRestaurants((prev) =>
                    prev.includes(restaurant.id) ? prev.filter((id) => id !== restaurant.id) : [...prev, restaurant.id],
                  )
                }}
              >
                {restaurant.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedRestaurants(restaurants.map((r) => r.id))}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedRestaurants([])}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={resetFilters} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Reset All Filters
        </Button>
        <Button onClick={exportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Filtered Data
        </Button>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Filtered Orders</p>
                <p className="text-2xl font-bold text-primary">{filteredData.summary.totalOrders}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary">${filteredData.summary.totalRevenue}</p>
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
                <p className="text-2xl font-bold text-accent">${filteredData.summary.averageOrderValue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Restaurants</p>
                <p className="text-2xl font-bold text-chart-4">{filteredData.summary.uniqueRestaurants}</p>
              </div>
              <Store className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Filtered Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: { label: "Orders", color: "hsl(var(--chart-1))" },
                revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Hourly Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: { label: "Orders", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData.hourlyChartData}>
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
    </div>
  )
}
