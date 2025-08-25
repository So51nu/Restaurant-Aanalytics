"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Trophy, Crown, Medal, TrendingUp, DollarSign, ShoppingBag, Star, MapPin } from "lucide-react"
import { format, isWithinInterval, parseISO } from "date-fns"
import type { Restaurant, Order } from "@/lib/mock-data"
import Image from "next/image"

interface TopRestaurantsRankingProps {
  restaurants: Restaurant[]
  orders: Order[]
  dateRange: { from: Date; to: Date }
}

export function TopRestaurantsRanking({ restaurants, orders, dateRange }: TopRestaurantsRankingProps) {
  const rankingData = useMemo(() => {
    // Filter orders by date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = parseISO(order.date)
      return isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
    })

    // Calculate metrics for each restaurant
    const restaurantMetrics = restaurants.map((restaurant) => {
      const restaurantOrders = filteredOrders.filter((order) => order.restaurantId === restaurant.id)
      const totalRevenue = restaurantOrders.reduce((sum, order) => sum + order.amount, 0)
      const totalOrders = restaurantOrders.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      return {
        ...restaurant,
        periodRevenue: Math.round(totalRevenue),
        periodOrders: totalOrders,
        periodAOV: Math.round(averageOrderValue * 100) / 100,
        revenueGrowth: Math.round((Math.random() * 30 - 10) * 100) / 100, // Mock growth data
      }
    })

    // Sort by revenue and get top 3
    const topRestaurants = restaurantMetrics
      .sort((a, b) => b.periodRevenue - a.periodRevenue)
      .slice(0, 3)
      .map((restaurant, index) => ({
        ...restaurant,
        rank: index + 1,
        marketShare: Math.round(
          (restaurant.periodRevenue / restaurantMetrics.reduce((sum, r) => sum + r.periodRevenue, 0)) * 100,
        ),
      }))

    // Prepare chart data
    const chartData = topRestaurants.map((restaurant) => ({
      name: restaurant.name,
      revenue: restaurant.periodRevenue,
      orders: restaurant.periodOrders,
      aov: restaurant.periodAOV,
    }))

    const pieData = topRestaurants.map((restaurant, index) => ({
      name: restaurant.name,
      value: restaurant.periodRevenue,
      fill: `hsl(var(--chart-${index + 1}))`,
    }))

    return {
      topRestaurants,
      chartData,
      pieData,
      totalRevenue: restaurantMetrics.reduce((sum, r) => sum + r.periodRevenue, 0),
      totalOrders: restaurantMetrics.reduce((sum, r) => sum + r.periodOrders, 0),
    }
  }, [restaurants, orders, dateRange])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-bg text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-serif flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Top Restaurants Ranking
          </CardTitle>
          <p className="opacity-90">
            Performance leaders for {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
          </p>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Period Revenue</p>
                <p className="text-2xl font-bold text-primary">${rankingData.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Period Orders</p>
                <p className="text-2xl font-bold text-secondary">{rankingData.totalOrders.toLocaleString()}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold text-accent">3</p>
                <p className="text-xs text-muted-foreground">Leading restaurants</p>
              </div>
              <Crown className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Restaurants Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rankingData.topRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`card-hover relative overflow-hidden ${
              restaurant.rank === 1 ? "ring-2 ring-yellow-400 shadow-lg" : ""
            }`}
          >
            <div className="absolute top-4 right-4 z-10">
              <Badge className={`${getRankBadgeColor(restaurant.rank)} font-bold`}>#{restaurant.rank}</Badge>
            </div>

            <div className="relative h-32 w-full overflow-hidden">
              <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                {getRankIcon(restaurant.rank)}
                <span className="text-white font-semibold">{restaurant.name}</span>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{restaurant.cuisine}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {restaurant.location}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Revenue</span>
                    <span className="text-lg font-bold text-primary">${restaurant.periodRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={restaurant.marketShare} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{restaurant.marketShare}% market share</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-semibold">{restaurant.periodOrders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">AOV</p>
                    <p className="font-semibold">${restaurant.periodAOV}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Growth</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className={`h-3 w-3 ${restaurant.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${restaurant.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {restaurant.revenueGrowth >= 0 ? "+" : ""}
                      {restaurant.revenueGrowth}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Comparison Bar Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Revenue Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Market Share Pie Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Market Share Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue Share",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rankingData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rankingData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
