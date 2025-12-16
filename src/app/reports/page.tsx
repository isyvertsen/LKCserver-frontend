"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  Package,
  DollarSign,
  FileText,
  Printer,
  ClipboardList
} from "lucide-react"
import { format } from "date-fns"

// Mock data for charts
const salesData = [
  { month: "Jan", sales: 245000, orders: 342 },
  { month: "Feb", sales: 268000, orders: 368 },
  { month: "Mar", sales: 295000, orders: 412 },
  { month: "Apr", sales: 312000, orders: 445 },
  { month: "Mai", sales: 328000, orders: 468 },
  { month: "Jun", sales: 342000, orders: 492 },
]

const topProducts = [
  { name: "Fiskesuppe", quantity: 1234, revenue: 45600 },
  { name: "Kyllinggryte", quantity: 1089, revenue: 42300 },
  { name: "Lasagne", quantity: 978, revenue: 38900 },
  { name: "Laks med poteter", quantity: 856, revenue: 36200 },
  { name: "Kjøttboller", quantity: 745, revenue: 32100 },
]

const customerStats = [
  { type: "Skoler", count: 24, percentage: 35 },
  { type: "Sykehjem", count: 18, percentage: 26 },
  { type: "Barnehager", count: 15, percentage: 22 },
  { type: "Bedrifter", count: 12, percentage: 17 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("sales")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapporter</h1>
          <p className="text-gray-500 mt-2">Analyser salg, kunder og ytelse</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Denne uken</SelectItem>
              <SelectItem value="month">Denne måneden</SelectItem>
              <SelectItem value="quarter">Dette kvartalet</SelectItem>
              <SelectItem value="year">Dette året</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Skriv ut
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total omsetning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">kr 342,000</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% fra forrige måned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Antall ordrer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">492</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% fra forrige måned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Aktive kunder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">69</div>
            <p className="text-xs text-gray-500 mt-1">
              Fra 78 totalt
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gjennomsnittlig ordre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">kr 695</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5% fra forrige måned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList>
          <TabsTrigger value="sales">Salgsrapport</TabsTrigger>
          <TabsTrigger value="products">Produktrapport</TabsTrigger>
          <TabsTrigger value="customers">Kunderapport</TabsTrigger>
          <TabsTrigger value="nutrition">Ernæringsrapport</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salgsutvikling</CardTitle>
              <CardDescription>Månedlig salg og antall ordrer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {salesData.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-200 rounded-t" style={{ height: `${(month.sales / 350000) * 100}%` }}>
                      <div className="text-xs text-center pt-1">{month.orders}</div>
                    </div>
                    <div className="text-sm font-medium">{month.month}</div>
                    <div className="text-xs text-gray-600">kr {(month.sales / 1000).toFixed(0)}k</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Salg per kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hovedretter</span>
                    <span className="text-sm font-medium">kr 198,500 (58%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Supper</span>
                    <span className="text-sm font-medium">kr 89,200 (26%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Desserter</span>
                    <span className="text-sm font-medium">kr 34,200 (10%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Salater</span>
                    <span className="text-sm font-medium">kr 20,100 (6%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Betalingsmetoder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Faktura</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Kort</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Kontant</span>
                    <span className="text-sm font-medium">7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topp 10 produkter</CardTitle>
              <CardDescription>Mest solgte produkter denne perioden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-600">{product.quantity} solgt</span>
                      <span className="text-sm font-medium">kr {product.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Kundefordeling</CardTitle>
                <CardDescription>Kunder per segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerStats.map((stat) => (
                    <div key={stat.type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{stat.type}</span>
                        <span className="font-medium">{stat.count} ({stat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kundeaktivitet</CardTitle>
                <CardDescription>Ordrefrekvens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daglige kunder</span>
                    <span className="text-sm font-medium">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ukentlige kunder</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Månedlige kunder</span>
                    <span className="text-sm font-medium">13</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inaktive kunder</span>
                    <span className="text-sm font-medium text-red-600">9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ernæringsstatistikk</CardTitle>
              <CardDescription>Gjennomsnittlige næringsverdier per porsjon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">485</div>
                  <div className="text-sm text-gray-600">kcal</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">22g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">45g</div>
                  <div className="text-sm text-gray-600">Karbohydrater</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">18g</div>
                  <div className="text-sm text-gray-600">Fett</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Special Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Eksporter rapporter</CardTitle>
            <CardDescription>Last ned rapporter i forskjellige formater</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => window.location.href = '/reports/period-menu'}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <ClipboardList className="h-8 w-8 text-green-600" />
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">Periode Meny Rapport</CardTitle>
            <CardDescription className="mt-2">
              Generer kunderapport for spesifikke perioder med menyer og produkter
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}