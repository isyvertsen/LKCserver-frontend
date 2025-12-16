import { useQuery } from '@tanstack/react-query'
import { kategorierApi, Kategori } from '@/lib/api/kategorier'

export function useKategorierList() {
  return useQuery<Kategori[]>({
    queryKey: ['kategorier'],
    queryFn: () => kategorierApi.list(),
  })
}

export function useKategori(id: number) {
  return useQuery<Kategori>({
    queryKey: ['kategorier', id],
    queryFn: () => kategorierApi.get(id),
    enabled: !!id,
  })
}
