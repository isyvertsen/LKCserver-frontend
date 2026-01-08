'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useKunderList } from '@/hooks/useKunder'
import { usePerioderList } from '@/hooks/usePerioder'
import { useBestillingPerioder } from '@/hooks/useBestillingSkjema'
import { useOpprettOrdre } from '@/hooks/useBestillingRegistrer'
import { toast } from 'sonner'

interface BestillingLinje {
  produktid: number
  antall: number
}

interface PeriodeBestillingState {
  [periodeid: number]: {
    [produktid: number]: number
  }
}

export default function BestillingRegistrerPage() {
  const [kundeOpen, setKundeOpen] = useState(false)
  const [selectedKundeId, setSelectedKundeId] = useState<number | null>(null)
  const [selectedPerioder, setSelectedPerioder] = useState<number[]>([])
  const [bestillinger, setBestillinger] = useState<PeriodeBestillingState>({})

  // Hent kunder
  const { data: kunderData, isLoading: kunderLoading } = useKunderList({
    page_size: 500,
    sort_by: 'kundenavn',
    sort_order: 'asc',
  })

  // Finn valgt kunde
  const selectedKunde = useMemo(() => {
    if (!selectedKundeId || !kunderData?.items) return null
    return kunderData.items.find((k) => k.kundeid === selectedKundeId)
  }, [selectedKundeId, kunderData])

  // Hent perioder med produkter basert på kundens menygruppe
  const { data: perioderData, isLoading: perioderLoading } = useBestillingPerioder({
    menygruppe_id: selectedKunde?.menygruppeid ? Math.floor(selectedKunde.menygruppeid) : undefined,
  })

  // Mutation for å opprette ordre
  const opprettOrdreMutation = useOpprettOrdre()

  // Toggle periode valg
  const togglePeriode = (periodeid: number) => {
    setSelectedPerioder((prev) =>
      prev.includes(periodeid) ? prev.filter((p) => p !== periodeid) : [...prev, periodeid]
    )
  }

  // Oppdater antall for et produkt i en periode
  const updateAntall = (periodeid: number, produktid: number, antall: number) => {
    setBestillinger((prev) => ({
      ...prev,
      [periodeid]: {
        ...prev[periodeid],
        [produktid]: antall,
      },
    }))
  }

  // Hent alle unike produkter fra valgte perioder
  const produkter = useMemo(() => {
    if (!perioderData) return []

    const produktMap = new Map<
      number,
      { produktid: number; produktnavn: string | null; visningsnavn: string | null }
    >()

    perioderData
      .filter((p) => selectedPerioder.includes(p.menyperiodeid))
      .forEach((periode) => {
        periode.menyer.forEach((meny) => {
          meny.produkter.forEach((produkt) => {
            if (!produktMap.has(produkt.produktid)) {
              produktMap.set(produkt.produktid, {
                produktid: produkt.produktid,
                produktnavn: produkt.produktnavn,
                visningsnavn: produkt.visningsnavn,
              })
            }
          })
        })
      })

    return Array.from(produktMap.values()).sort((a, b) =>
      (a.visningsnavn || a.produktnavn || '').localeCompare(
        b.visningsnavn || b.produktnavn || ''
      )
    )
  }, [perioderData, selectedPerioder])

  // Lagre bestilling
  const handleSave = async () => {
    if (!selectedKundeId) {
      toast.error('Velg en kunde')
      return
    }

    if (selectedPerioder.length === 0) {
      toast.error('Velg minst en periode')
      return
    }

    // Bygg request
    const perioder = selectedPerioder.map((periodeid) => ({
      periodeid,
      linjer: Object.entries(bestillinger[periodeid] || {})
        .filter(([_, antall]) => antall > 0)
        .map(([produktid, antall]) => ({
          produktid: parseInt(produktid),
          antall,
        })),
    }))

    // Sjekk at det er minst en linje med antall > 0
    const harLinjer = perioder.some((p) => p.linjer.length > 0)
    if (!harLinjer) {
      toast.error('Legg inn antall for minst ett produkt')
      return
    }

    try {
      const result = await opprettOrdreMutation.mutateAsync({
        kundeid: selectedKundeId,
        perioder,
      })
      toast.success(result.melding)

      // Reset form
      setBestillinger({})
      setSelectedPerioder([])
    } catch (error) {
      toast.error('Kunne ikke opprette ordre')
    }
  }

  const formatPeriodeLabel = (periode: { ukenr: number | null; fradato: string | null }) => {
    const uke = periode.ukenr ? `Uke ${periode.ukenr}` : ''
    const dato = periode.fradato
      ? new Date(periode.fradato).toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit' })
      : ''
    return uke && dato ? `${uke} (${dato})` : uke || dato || 'Ukjent'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registrer Bestilling</h1>
          <p className="text-muted-foreground mt-1">
            Registrer bestillinger fra papirskjema
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={
            !selectedKundeId ||
            selectedPerioder.length === 0 ||
            opprettOrdreMutation.isPending
          }
        >
          {opprettOrdreMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Lagre bestilling
        </Button>
      </div>

      {/* Kundevalg */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Kunde</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={kundeOpen} onOpenChange={setKundeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={kundeOpen}
                className="w-full justify-between"
              >
                {selectedKunde
                  ? `${selectedKunde.kundeid} - ${selectedKunde.kundenavn}`
                  : 'Velg kunde...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Sok etter kunde..." />
                <CommandList>
                  <CommandEmpty>Ingen kunder funnet.</CommandEmpty>
                  <CommandGroup>
                    {kunderData?.items?.map((kunde) => (
                      <CommandItem
                        key={kunde.kundeid}
                        value={`${kunde.kundeid} ${kunde.kundenavn}`}
                        onSelect={() => {
                          setSelectedKundeId(kunde.kundeid)
                          setKundeOpen(false)
                          // Reset perioder og bestillinger ved kundebytte
                          setSelectedPerioder([])
                          setBestillinger({})
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedKundeId === kunde.kundeid ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {kunde.kundeid} - {kunde.kundenavn}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedKunde && (
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Menygruppe:</span>{' '}
                  {selectedKunde.menygruppeid || 'Ikke satt'}
                </div>
                <div>
                  <span className="text-muted-foreground">Leveringsdag:</span>{' '}
                  {selectedKunde.leveringsdag || '-'}
                </div>
                {selectedKunde.adresse && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Adresse:</span>{' '}
                    {selectedKunde.adresse}, {selectedKunde.postnr} {selectedKunde.sted}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Periodevalg */}
      {selectedKunde && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Velg perioder</CardTitle>
          </CardHeader>
          <CardContent>
            {perioderLoading ? (
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {perioderData?.map((periode) => (
                  <label
                    key={periode.menyperiodeid}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                      selectedPerioder.includes(periode.menyperiodeid)
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-muted'
                    )}
                  >
                    <Checkbox
                      checked={selectedPerioder.includes(periode.menyperiodeid)}
                      onCheckedChange={() => togglePeriode(periode.menyperiodeid)}
                    />
                    <span>{formatPeriodeLabel(periode)}</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Produkttabell */}
      {selectedKunde && selectedPerioder.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Produkter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 w-16">ID</th>
                    <th className="text-left py-2 px-3">Produkt</th>
                    {perioderData
                      ?.filter((p) => selectedPerioder.includes(p.menyperiodeid))
                      .map((periode) => (
                        <th
                          key={periode.menyperiodeid}
                          className="text-center py-2 px-3 w-24"
                        >
                          Uke {periode.ukenr}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {produkter.map((produkt) => (
                    <tr key={produkt.produktid} className="border-b last:border-0">
                      <td className="py-2 px-3 text-muted-foreground">
                        {produkt.produktid}
                      </td>
                      <td className="py-2 px-3">
                        {produkt.visningsnavn || produkt.produktnavn}
                      </td>
                      {perioderData
                        ?.filter((p) => selectedPerioder.includes(p.menyperiodeid))
                        .map((periode) => (
                          <td key={periode.menyperiodeid} className="py-2 px-3 text-center">
                            <Input
                              type="number"
                              min={0}
                              className="w-20 mx-auto text-center"
                              value={
                                bestillinger[periode.menyperiodeid]?.[produkt.produktid] || ''
                              }
                              onChange={(e) =>
                                updateAntall(
                                  periode.menyperiodeid,
                                  produkt.produktid,
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {produkter.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Ingen produkter funnet for valgte perioder
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
