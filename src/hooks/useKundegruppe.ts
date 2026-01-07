import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kundegruppeApi, Kundegruppe, KundegruppeCreate, KundegruppeUpdate } from '@/lib/api/kundegruppe'

export function useKundegrupper() {
  return useQuery<Kundegruppe[]>({
    queryKey: ['kundegrupper'],
    queryFn: kundegruppeApi.list,
  })
}

export function useKundegruppe(id: number) {
  return useQuery<Kundegruppe>({
    queryKey: ['kundegruppe', id],
    queryFn: () => kundegruppeApi.get(id),
    enabled: !!id,
  })
}

export function useCreateKundegruppe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: KundegruppeCreate) => kundegruppeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kundegrupper'] })
    },
  })
}

export function useUpdateKundegruppe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: KundegruppeUpdate }) =>
      kundegruppeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kundegrupper'] })
    },
  })
}

export function useDeleteKundegruppe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => kundegruppeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kundegrupper'] })
    },
  })
}