"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Users, TrendingUp, Star, BarChart3, ChefHat, Utensils } from "lucide-react"
import { OverviewMetrics } from "./dashboard/overview-metrics"
import { SalesAnalytics } from "./dashboard/sales-analytics"
import { MenuInsights } from "./dashboard/menu-insights"
import { CustomerAnalytics } from "./dashboard/customer-analytics"
import { ReportsExport } from "./dashboard/reports-export"

export function RestaurantDashboard() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("all")
  const [dateRange, setDateRange] = useState("7d")

  const restaurants = [
    { id: "all", name: "All Restaurants" },
    { id: "1", name: "Downtown Branch" },
    { id: "2", name: "Mall Location" },
    { id: "3", name: "Airport Terminal" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <header className="relative border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/elegant-restaurant-interior.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg animate-pulse-glow">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Restaurant Analytics
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  Track performance and insights across your restaurants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger className="w-48 border-orange-200 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 border-orange-200 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Today</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 animate-pulse">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-ping" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm border border-orange-100 shadow-lg rounded-xl p-2">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <TrendingUp className="w-4 h-4" />
              Sales Analytics
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <Star className="w-4 h-4" />
              Menu Insights
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <Users className="w-4 h-4" />
              Customer Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <CalendarDays className="w-4 h-4" />
              Reports & Export
            </TabsTrigger>
          </TabsList>

          <div className="animate-fade-in-up">
            <TabsContent value="overview">
              <OverviewMetrics selectedRestaurant={selectedRestaurant} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="sales">
              <SalesAnalytics selectedRestaurant={selectedRestaurant} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="menu">
              <MenuInsights selectedRestaurant={selectedRestaurant} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerAnalytics selectedRestaurant={selectedRestaurant} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsExport selectedRestaurant={selectedRestaurant} dateRange={dateRange} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
