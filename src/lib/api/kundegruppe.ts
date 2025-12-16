import { apiClient } from '@/lib/api-client'

export interface Kundegruppe {
  gruppeid: number
  gruppe: string
  webshop: boolean
  autofaktura: boolean
}

export const kundegruppeApi = {
  list: async (): Promise<Kundegruppe[]> => {
    const response = await apiClient.get('/v1/kunde-gruppe/')
    return response.data
  }
}