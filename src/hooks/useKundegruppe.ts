import { useQuery } from '@tanstack/react-query'
import { kundegruppeApi, Kundegruppe } from '@/lib/api/kundegruppe'

export function useKundegrupper() {
  return useQuery<Kundegruppe[]>({
    queryKey: ['kundegrupper'],
    queryFn: kundegruppeApi.list,
  })
}