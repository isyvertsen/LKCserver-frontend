"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useCombinedDishesList,
  useDeleteCombinedDish
} from "@/hooks/useCombinedDishes"
import { CombinedDish } from "@/lib/api/combined-dishes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MoreHorizontal, Pencil, Trash2, Search, UtensilsCrossed, ChefHat, Package } from "lucide-react"
import { format } from "date-fns"
import { nb } from "date-fns/locale"

export default function DishesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingDish, setDeletingDish] = useState<CombinedDish | null>(null)

  const { data, isLoading } = useCombinedDishesList({
    skip: 0,
    limit: 100,
    search: searchTerm || undefined
  })
  const deleteMutation = useDeleteCombinedDish()

  const dishes = data?.items || []

  const handleEdit = (dish: CombinedDish) => {
    router.push(`/dishes/create?id=${dish.id}`)
  }

  const handleDelete = (dish: CombinedDish) => {
    setDeletingDish(dish)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingDish) {
      deleteMutation.mutate(deletingDish.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeletingDish(null)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sammensatte retter</h1>
          <p className="text-muted-foreground">
            Kombiner oppskrifter og produkter til komplette retter
          </p>
        </div>
        <Link href="/dishes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ny rett
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alle retter</CardTitle>
              <CardDescription>
                {dishes.length} retter totalt
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Søk etter rett..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Komponenter</TableHead>
                <TableHead>Opprettet</TableHead>
                <TableHead className="w-[100px]">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UtensilsCrossed className="h-8 w-8" />
                      <p>Ingen retter funnet.</p>
                      <Link href="/dishes/create">
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Opprett din første rett
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                dishes.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dish.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {dish.recipe_components.length > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <ChefHat className="h-3 w-3" />
                            {dish.recipe_components.length} oppskrift{dish.recipe_components.length !== 1 ? 'er' : ''}
                          </Badge>
                        )}
                        {dish.product_components.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <Package className="h-3 w-3" />
                            {dish.product_components.length} produkt{dish.product_components.length !== 1 ? 'er' : ''}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(dish.created_at), "d. MMM yyyy", { locale: nb })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Åpne meny</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(dish)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rediger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(dish)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Slett
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette retten &quot;{deletingDish?.name}&quot;.
              Handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Sletter..." : "Slett"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
