"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MenuInsightsProps {
  selectedRestaurant: string
  dateRange: string
}

export function MenuInsights({ selectedRestaurant, dateRange }: MenuInsightsProps) {
  const topSellingItems = [
    { name: "Grilled Salmon", orders: 234, revenue: 4680, rating: 4.8, trend: "up" },
    { name: "Chicken Caesar Salad", orders: 198, revenue: 2970, rating: 4.6, trend: "up" },
    { name: "Beef Burger Deluxe", orders: 187, revenue: 2805, rating: 4.7, trend: "down" },
    { name: "Margherita Pizza", orders: 156, revenue: 2340, rating: 4.5, trend: "up" },
    { name: "Pasta Carbonara", orders: 143, revenue: 2145, rating: 4.4, trend: "stable" },
  ]

  const leastSellingItems = [
    { name: "Quinoa Bowl", orders: 12, revenue: 180, rating: 4.2, trend: "down" },
    { name: "Vegan Wrap", orders: 18, revenue: 216, rating: 4.0, trend: "down" },
    { name: "Fish Tacos", orders: 23, revenue: 345, rating: 4.1, trend: "stable" },
    { name: "Mushroom Risotto", orders: 28, revenue: 420, rating: 4.3, trend: "up" },
  ]

  const categoryPerformance = [
    { category: "Main Dishes", orders: 892, revenue: 17840, avgRating: 4.6 },
    { category: "Appetizers", orders: 456, revenue: 4560, avgRating: 4.4 },
    { category: "Beverages", orders: 678, revenue: 3390, avgRating: 4.2 },
    { category: "Desserts", orders: 234, revenue: 2340, avgRating: 4.5 },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Selling Items
            </CardTitle>
            <CardDescription>Most popular dishes driving revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {index + 1}. {item.name}
                      </span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{item.orders} orders</span>
                      <span>${item.revenue.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.orders} sold</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Underperforming Items
            </CardTitle>
            <CardDescription>Items that may need menu optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leastSellingItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{item.orders} orders</span>
                      <span>${item.revenue}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Low sales
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Revenue and order volume by menu category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <YAxis yAxisId="orders" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : value,
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
              />
              <Bar yAxisId="revenue" dataKey="revenue" fill="hsl(var(--chart-1))" />
              <Bar yAxisId="orders" dataKey="orders" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {categoryPerformance.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Orders</span>
                  <span className="font-medium">{category.orders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue</span>
                  <span className="font-medium">${category.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{category.avgRating}</span>
                  </div>
                </div>
                <Progress value={(category.orders / 892) * 100} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
