"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info } from "lucide-react"

interface Allergen {
  code: string
  level: string // CONTAINS, MAY_CONTAIN
  name: string
}

interface AllergenDisplayProps {
  allergens: Allergen[]
}

export function AllergenDisplay({ allergens }: AllergenDisplayProps) {
  if (!allergens || allergens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergener</CardTitle>
          <CardDescription>Ingen allergener funnet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Denne retten inneholder ingen kjente allergener</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const containsAllergens = allergens.filter((a) => a.level === "CONTAINS")
  const mayContainAllergens = allergens.filter((a) => a.level === "MAY_CONTAIN")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allergener</CardTitle>
        <CardDescription>
          Allergeninformasjon for denne retten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {containsAllergens.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Inneholder
            </h4>
            <div className="flex flex-wrap gap-2">
              {containsAllergens.map((allergen) => (
                <Badge
                  key={allergen.code}
                  variant="destructive"
                  className="text-sm"
                >
                  {allergen.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {mayContainAllergens.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-yellow-600" />
              Kan inneholde
            </h4>
            <div className="flex flex-wrap gap-2">
              {mayContainAllergens.map((allergen) => (
                <Badge
                  key={allergen.code}
                  variant="outline"
                  className="text-sm border-yellow-600 text-yellow-700"
                >
                  {allergen.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
