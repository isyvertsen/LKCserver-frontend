"use client"

import { useState } from "react"
import {
  usePerioderList,
  useCreatePeriode,
  useUpdatePeriode,
  useDeletePeriode
} from "@/hooks/usePerioder"
import { Periode } from "@/lib/api/perioder"
import { PeriodeDialog, PeriodeFormValues } from "@/components/perioder/periode-dialog"
import { Button } from "@/components/ui/button"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

function formatDate(dateString: string | null): string {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  } catch {
    return "-"
  }
}

export default function PerioderPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPeriode, setEditingPeriode] = useState<Periode | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPeriode, setDeletingPeriode] = useState<Periode | null>(null)

  const { data, isLoading } = usePerioderList()
  const createMutation = useCreatePeriode()
  const updateMutation = useUpdatePeriode()
  const deleteMutation = useDeletePeriode()

  const perioder = data?.items || []

  const handleCreate = () => {
    setEditingPeriode(null)
    setDialogOpen(true)
  }

  const handleEdit = (periode: Periode) => {
    setEditingPeriode(periode)
    setDialogOpen(true)
  }

  const handleDelete = (periode: Periode) => {
    setDeletingPeriode(periode)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = (data: PeriodeFormValues) => {
    if (editingPeriode) {
      updateMutation.mutate(
        { id: editingPeriode.menyperiodeid, data },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setEditingPeriode(null)
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false)
        },
      })
    }
  }

  const confirmDelete = () => {
    if (deletingPeriode) {
      deleteMutation.mutate(deletingPeriode.menyperiodeid, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeletingPeriode(null)
        },
      })
    }
  }

  const getPeriodeDisplayName = (periode: Periode): string => {
    if (periode.ukenr) return `Uke ${periode.ukenr}`
    return `Periode ${periode.menyperiodeid}`
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
                <Skeleton key={i} className="h-12 w-full" />
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
          <h1 className="text-3xl font-bold tracking-tight">Perioder</h1>
          <p className="text-muted-foreground">
            Administrer menyperioder
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ny periode
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle perioder</CardTitle>
          <CardDescription>
            {perioder.length} perioder totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ukenummer</TableHead>
                <TableHead>Fra dato</TableHead>
                <TableHead>Til dato</TableHead>
                <TableHead className="w-[100px]">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perioder.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Ingen perioder funnet. Opprett en ny periode for å komme i gang.
                  </TableCell>
                </TableRow>
              ) : (
                perioder.map((periode) => (
                  <TableRow key={periode.menyperiodeid}>
                    <TableCell className="font-medium">
                      {periode.ukenr ? `Uke ${periode.ukenr}` : "-"}
                    </TableCell>
                    <TableCell>{formatDate(periode.fradato)}</TableCell>
                    <TableCell>{formatDate(periode.tildato)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Åpne meny</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(periode)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rediger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(periode)}
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

      <PeriodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        periode={editingPeriode}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette &quot;{deletingPeriode ? getPeriodeDisplayName(deletingPeriode) : ''}&quot;.
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
