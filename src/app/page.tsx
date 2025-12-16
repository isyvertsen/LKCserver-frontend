"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Calendar,
  ChefHat,
  Truck,
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface DashboardStats {
  totalCustomers: number
  totalEmployees: number
  totalProducts: number
  totalOrders: number
  totalMenus: number
  totalRecipes: number
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    // Effektivt: Hent kun totaler fra dedikert stats-endpoint
    const response = await apiClient.get('/v1/stats/')

    return {
      totalCustomers: response.data.total_customers || 0,
      totalEmployees: response.data.total_employees || 0,
      totalProducts: response.data.total_products || 0,
      totalOrders: response.data.total_orders || 0,
      totalMenus: response.data.total_menus || 0,
      totalRecipes: response.data.total_recipes || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalCustomers: 0,
      totalEmployees: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalMenus: 0,
      totalRecipes: 0,
    }
  }
}

export default function HomePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Laster data...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Velkommen tilbake! Her er dagens oversikt.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/customers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kunder</CardTitle>
              <div className="p-2 rounded-lg text-blue-600 bg-blue-50">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-gray-600">
                Totalt antall kunder
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordrer</CardTitle>
              <div className="p-2 rounded-lg text-green-600 bg-green-50">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-gray-600">
                Totalt antall ordrer
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/recipes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oppskrifter</CardTitle>
              <div className="p-2 rounded-lg text-purple-600 bg-purple-50">
                <ChefHat className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRecipes || 0}</div>
              <p className="text-xs text-gray-600">
                Totalt antall oppskrifter
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produkter</CardTitle>
              <div className="p-2 rounded-lg text-orange-600 bg-orange-50">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-gray-600">
                Totalt antall produkter
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hurtigtilgang
            </CardTitle>
            <CardDescription>Vanlige handlinger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Link href="/orders/new">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ny ordre
                </Button>
              </Link>
              <Link href="/customers/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Ny kunde
                </Button>
              </Link>
              <Link href="/produkter">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Produkter
                </Button>
              </Link>
              <Link href="/recipes/new">
                <Button variant="outline" className="w-full justify-start">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Ny oppskrift
                </Button>
              </Link>
              <Link href="/menus">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Menyer
                </Button>
              </Link>
              <Link href="/employees/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Ny ansatt
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Systemoversikt</CardTitle>
          <CardDescription>Komplett oversikt over alle moduler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-700">Personer</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Ansatte</span>
                  <span className="font-medium">{stats?.totalEmployees || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kunder</span>
                  <span className="font-medium">{stats?.totalCustomers || 0}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-700">Produkter & Menyer</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Produkter</span>
                  <span className="font-medium">{stats?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Menyer</span>
                  <span className="font-medium">{stats?.totalMenus || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Oppskrifter</span>
                  <span className="font-medium">{stats?.totalRecipes || 0}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-700">Ordrer</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Totalt</span>
                  <span className="font-medium">{stats?.totalOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}