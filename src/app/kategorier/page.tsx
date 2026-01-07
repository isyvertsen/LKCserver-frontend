"use client"

import { useState } from "react"
import {
  useKategorierList,
  useCreateKategori,
  useUpdateKategori,
  useDeleteKategori
} from "@/hooks/useKategorier"
import { Kategori } from "@/lib/api/kategorier"
import { KategoriDialog, KategoriFormValues } from "@/components/kategorier/kategori-dialog"
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

export default function KategorierPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingKategori, setDeletingKategori] = useState<Kategori | null>(null)

  const { data, isLoading } = useKategorierList()
  const createMutation = useCreateKategori()
  const updateMutation = useUpdateKategori()
  const deleteMutation = useDeleteKategori()

  const kategorier = data?.items || []

  const handleCreate = () => {
    setEditingKategori(null)
    setDialogOpen(true)
  }

  const handleEdit = (kategori: Kategori) => {
    setEditingKategori(kategori)
    setDialogOpen(true)
  }

  const handleDelete = (kategori: Kategori) => {
    setDeletingKategori(kategori)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = (data: KategoriFormValues) => {
    if (editingKategori) {
      updateMutation.mutate(
        { id: editingKategori.kategoriid, data },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setEditingKategori(null)
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
    if (deletingKategori) {
      deleteMutation.mutate(deletingKategori.kategoriid, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeletingKategori(null)
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
          <h1 className="text-3xl font-bold tracking-tight">Kategorier</h1>
          <p className="text-muted-foreground">
            Administrer produktkategorier
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ny kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle kategorier</CardTitle>
          <CardDescription>
            {kategorier.length} kategorier totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Beskrivelse</TableHead>
                <TableHead className="w-[100px]">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kategorier.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Ingen kategorier funnet. Opprett en ny kategori for å komme i gang.
                  </TableCell>
                </TableRow>
              ) : (
                kategorier.map((kategori) => (
                  <TableRow key={kategori.kategoriid}>
                    <TableCell className="font-medium">{kategori.kategori}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {kategori.beskrivelse || "-"}
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
                          <DropdownMenuItem onClick={() => handleEdit(kategori)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rediger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(kategori)}
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

      <KategoriDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        kategori={editingKategori}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette kategorien &quot;{deletingKategori?.kategori}&quot;.
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
