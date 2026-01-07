"use client"

import { useState } from "react"
import {
  useKundegrupper,
  useCreateKundegruppe,
  useUpdateKundegruppe,
  useDeleteKundegruppe
} from "@/hooks/useKundegruppe"
import { Kundegruppe, KundegruppeCreate } from "@/lib/api/kundegruppe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Check, X, Search } from "lucide-react"

export default function KundegrupperPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGruppe, setEditingGruppe] = useState<Kundegruppe | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGruppe, setDeletingGruppe] = useState<Kundegruppe | null>(null)

  // Form state
  const [formData, setFormData] = useState<KundegruppeCreate>({
    gruppe: "",
    webshop: false,
    autofaktura: false,
  })

  const { data: kundegrupper, isLoading } = useKundegrupper()
  const createMutation = useCreateKundegruppe()
  const updateMutation = useUpdateKundegruppe()
  const deleteMutation = useDeleteKundegruppe()

  const handleCreate = () => {
    setEditingGruppe(null)
    setFormData({ gruppe: "", webshop: false, autofaktura: false })
    setDialogOpen(true)
  }

  const handleEdit = (gruppe: Kundegruppe) => {
    setEditingGruppe(gruppe)
    setFormData({
      gruppe: gruppe.gruppe,
      webshop: gruppe.webshop,
      autofaktura: gruppe.autofaktura,
    })
    setDialogOpen(true)
  }

  const handleDelete = (gruppe: Kundegruppe) => {
    setDeletingGruppe(gruppe)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.gruppe.trim()) return

    if (editingGruppe) {
      updateMutation.mutate(
        { id: editingGruppe.gruppeid, data: formData },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setEditingGruppe(null)
          },
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setDialogOpen(false)
          setFormData({ gruppe: "", webshop: false, autofaktura: false })
        },
      })
    }
  }

  const confirmDelete = () => {
    if (deletingGruppe) {
      deleteMutation.mutate(deletingGruppe.gruppeid, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeletingGruppe(null)
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
          <h1 className="text-3xl font-bold tracking-tight">Kundegrupper</h1>
          <p className="text-muted-foreground">
            Administrer kundegrupper for segmentering
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ny kundegruppe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alle kundegrupper</CardTitle>
              <CardDescription>
                {kundegrupper?.length || 0} kundegrupper totalt
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Søk etter kundegruppe..."
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
                <TableHead>Webshop</TableHead>
                <TableHead>Autofaktura</TableHead>
                <TableHead className="w-[100px]">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const filtered = kundegrupper?.filter(g =>
                  g.gruppe.toLowerCase().includes(searchTerm.toLowerCase())
                ) || []

                if (filtered.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {searchTerm ? "Ingen kundegrupper matcher søket." : "Ingen kundegrupper funnet. Opprett en ny kundegruppe for å komme i gang."}
                      </TableCell>
                    </TableRow>
                  )
                }

                return filtered.map((gruppe) => (
                  <TableRow key={gruppe.gruppeid}>
                    <TableCell className="font-medium">{gruppe.gruppe}</TableCell>
                    <TableCell>
                      {gruppe.webshop ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Ja
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="mr-1 h-3 w-3" />
                          Nei
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {gruppe.autofaktura ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Ja
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="mr-1 h-3 w-3" />
                          Nei
                        </Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => handleEdit(gruppe)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rediger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(gruppe)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Slett
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGruppe ? "Rediger kundegruppe" : "Ny kundegruppe"}
            </DialogTitle>
            <DialogDescription>
              {editingGruppe
                ? "Oppdater informasjon om kundegruppen"
                : "Opprett en ny kundegruppe for å segmentere kunder"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="gruppe">Gruppenavn *</Label>
                <Input
                  id="gruppe"
                  value={formData.gruppe}
                  onChange={(e) => setFormData({ ...formData, gruppe: e.target.value })}
                  placeholder="F.eks. Bedriftskunder"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="webshop">Webshop-tilgang</Label>
                  <p className="text-sm text-muted-foreground">
                    Kan kunder i denne gruppen bestille via webshop?
                  </p>
                </div>
                <Switch
                  id="webshop"
                  checked={formData.webshop}
                  onCheckedChange={(checked) => setFormData({ ...formData, webshop: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autofaktura">Autofaktura</Label>
                  <p className="text-sm text-muted-foreground">
                    Skal faktura genereres automatisk?
                  </p>
                </div>
                <Switch
                  id="autofaktura"
                  checked={formData.autofaktura}
                  onCheckedChange={(checked) => setFormData({ ...formData, autofaktura: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? "Lagrer..."
                  : editingGruppe
                  ? "Oppdater"
                  : "Opprett"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette kundegruppen &quot;{deletingGruppe?.gruppe}&quot;.
              Kunder i denne gruppen må flyttes til en annen gruppe.
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
