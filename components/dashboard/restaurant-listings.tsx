"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, TrendingUp, DollarSign, ShoppingBag } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"
import Image from "next/image"

interface RestaurantListingsProps {
  restaurants: Restaurant[]
  onSelectRestaurant: (restaurant: Restaurant) => void
  selectedRestaurant: Restaurant | null
}

export function RestaurantListings({ restaurants, onSelectRestaurant, selectedRestaurant }: RestaurantListingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCuisine, setFilterCuisine] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  const cuisines = useMemo(() => {
    const uniqueCuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)))
    return uniqueCuisines
  }, [restaurants])

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(restaurants.map((r) => r.location)))
    return uniqueLocations
  }, [restaurants])

  const filteredAndSortedRestaurants = useMemo(() => {
    const filtered = restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCuisine = filterCuisine === "all" || restaurant.cuisine === filterCuisine
      const matchesLocation = filterLocation === "all" || restaurant.location === filterLocation

      return matchesSearch && matchesCuisine && matchesLocation
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "revenue":
          return b.totalRevenue - a.totalRevenue
        case "orders":
          return b.totalOrders - a.totalOrders
        case "aov":
          return b.averageOrderValue - a.averageOrderValue
        default:
          return 0
      }
    })
  }, [restaurants, searchTerm, sortBy, filterCuisine, filterLocation])

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Search className="h-5 w-5" />
            Search & Filter Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="aov">Avg Order Value</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCuisine} onValueChange={setFilterCuisine}>
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

            <Select value={filterLocation} onValueChange={setFilterLocation}>
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

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSortBy("name")
                setFilterCuisine("all")
                setFilterLocation("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedRestaurants.length} of {restaurants.length} restaurants
        </p>
        {selectedRestaurant && (
          <Badge variant="secondary" className="animate-pulse-glow">
            Selected: {selectedRestaurant.name}
          </Badge>
        )}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`card-hover cursor-pointer transition-all duration-300 ${
              selectedRestaurant?.id === restaurant.id ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-md"
            }`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary/90 text-primary-foreground">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {restaurant.rating}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-foreground">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{restaurant.cuisine}</Badge>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {restaurant.location}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      <DollarSign className="h-3 w-3" />
                    </div>
                    <div className="font-semibold">${restaurant.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>

                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                      <ShoppingBag className="h-3 w-3" />
                    </div>
                    <div className="font-semibold">{restaurant.totalOrders}</div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>

                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="flex items-center justify-center gap-1 text-accent mb-1">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                    <div className="font-semibold">${restaurant.averageOrderValue.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">AOV</div>
                  </div>
                </div>

                <Button className="w-full" variant={selectedRestaurant?.id === restaurant.id ? "default" : "outline"}>
                  {selectedRestaurant?.id === restaurant.id ? "Selected" : "Select Restaurant"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedRestaurants.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
