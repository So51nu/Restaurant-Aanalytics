export interface Restaurant {
  id: string
  name: string
  cuisine: string
  location: string
  rating: number
  image: string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
}

export interface Order {
  id: string
  restaurantId: string
  amount: number
  orderTime: string
  date: string
  hour: number
  customerName: string
  items: string[]
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bella Italia",
    cuisine: "Italian",
    location: "Downtown",
    rating: 4.8,
    image: "/italian-restaurant-interior.png",
    totalOrders: 1250,
    totalRevenue: 45600,
    averageOrderValue: 36.48,
  },
  {
    id: "2",
    name: "Dragon Palace",
    cuisine: "Chinese",
    location: "Chinatown",
    rating: 4.6,
    image: "/chinese-restaurant-interior.png",
    totalOrders: 980,
    totalRevenue: 38200,
    averageOrderValue: 38.98,
  },
  {
    id: "3",
    name: "Spice Garden",
    cuisine: "Indian",
    location: "Little India",
    rating: 4.7,
    image: "/indian-restaurant-interior.png",
    totalOrders: 1100,
    totalRevenue: 42800,
    averageOrderValue: 38.91,
  },
  {
    id: "4",
    name: "Sakura Sushi",
    cuisine: "Japanese",
    location: "Midtown",
    rating: 4.9,
    image: "/japanese-sushi-restaurant.png",
    totalOrders: 850,
    totalRevenue: 51200,
    averageOrderValue: 60.24,
  },
]

// Generate mock orders for the past 7 days
export const generateMockOrders = (): Order[] => {
  const orders: Order[] = []
  const today = new Date()

  for (let day = 0; day < 7; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() - day)
    const dateStr = date.toISOString().split("T")[0]

    // Generate 20-40 orders per day per restaurant
    mockRestaurants.forEach((restaurant) => {
      const ordersPerDay = Math.floor(Math.random() * 20) + 20

      for (let i = 0; i < ordersPerDay; i++) {
        const hour = Math.floor(Math.random() * 14) + 10 // 10 AM to 11 PM
        const minute = Math.floor(Math.random() * 60)
        const orderTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        const baseAmount = restaurant.averageOrderValue
        const amount = Math.round((baseAmount + (Math.random() - 0.5) * 20) * 100) / 100

        orders.push({
          id: `${restaurant.id}-${dateStr}-${i}`,
          restaurantId: restaurant.id,
          amount,
          orderTime,
          date: dateStr,
          hour,
          customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
          items: [`Item ${Math.floor(Math.random() * 10) + 1}`],
        })
      }
    })
  }

  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const mockOrders = generateMockOrders()
