"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantListings } from "./dashboard/restaurant-listings"
import { OrderTrendsAnalytics } from "./dashboard/order-trends-analytics"
import { TopRestaurantsRanking } from "./dashboard/top-restaurants-ranking"
import { AdvancedFilters } from "./dashboard/advanced-filters"
import { mockRestaurants, mockOrders, type Restaurant } from "@/lib/mock-data"
import { TrendingUp, Store, BarChart3, Filter } from "lucide-react"

export function RestaurantTrendsDashboard() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() })
  const [filters, setFilters] = useState({
    amountRange: { min: 0, max: 200 },
    hourRange: { min: 0, max: 23 },
    cuisine: "",
    location: "",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="gradient-bg text-white py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8" />
            <h1 className="text-4xl font-serif font-bold">Restaurant Order Trends</h1>
          </div>
          <p className="text-lg opacity-90">Comprehensive analytics dashboard for restaurant performance insights</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="restaurants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Order Trends
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Performers
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="animate-fade-in-up">
            <RestaurantListings
              restaurants={mockRestaurants}
              onSelectRestaurant={setSelectedRestaurant}
              selectedRestaurant={selectedRestaurant}
            />
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in-up">
            <OrderTrendsAnalytics
              selectedRestaurant={selectedRestaurant}
              orders={mockOrders}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </TabsContent>

          <TabsContent value="ranking" className="animate-fade-in-up">
            <TopRestaurantsRanking restaurants={mockRestaurants} orders={mockOrders} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="filters" className="animate-fade-in-up">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              restaurants={mockRestaurants}
              orders={mockOrders}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
