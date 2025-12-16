"use client"

import { Badge } from "@/components/ui/badge"
import { MatinfoAllergenInfo } from "@/lib/api/produkter"
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react"

interface AllergenBadgeProps {
  allergen: MatinfoAllergenInfo
  size?: "sm" | "md" | "lg"
}

const allergenLevelConfig = {
  CONTAINS: {
    variant: "destructive" as const,
    icon: AlertCircle,
    label: "Inneholder",
    className: "bg-red-500 hover:bg-red-600"
  },
  MAY_CONTAIN: {
    variant: "secondary" as const,
    icon: AlertTriangle,
    label: "Kan inneholde",
    className: "bg-yellow-500 hover:bg-yellow-600 text-white"
  },
  FREE_FROM: {
    variant: "outline" as const,
    icon: XCircle,
    label: "Fri fra",
    className: "bg-green-50 text-green-700 border-green-300"
  }
}

export function AllergenBadge({ allergen, size = "md" }: AllergenBadgeProps) {
  const config = allergenLevelConfig[allergen.level as keyof typeof allergenLevelConfig] || allergenLevelConfig.CONTAINS
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  }

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {allergen.name}
    </Badge>
  )
}

interface AllergenListProps {
  allergens: MatinfoAllergenInfo[]
  maxDisplay?: number
}

export function AllergenList({ allergens, maxDisplay = 5 }: AllergenListProps) {
  if (allergens.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Ingen allergeninformasjon tilgjengelig
      </div>
    )
  }

  // Sorter: CONTAINS først, deretter MAY_CONTAIN, til slutt FREE_FROM
  const sortedAllergens = [...allergens].sort((a, b) => {
    const order = { CONTAINS: 0, MAY_CONTAIN: 1, FREE_FROM: 2 }
    return (order[a.level as keyof typeof order] || 3) - (order[b.level as keyof typeof order] || 3)
  })

  const displayAllergens = sortedAllergens.slice(0, maxDisplay)
  const remaining = allergens.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayAllergens.map((allergen, idx) => (
        <AllergenBadge key={`${allergen.code}-${idx}`} allergen={allergen} size="sm" />
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remaining} flere
        </Badge>
      )}
    </div>
  )
}
