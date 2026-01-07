import { apiClient } from '@/lib/api-client'

export interface Kundegruppe {
  gruppeid: number
  gruppe: string
  webshop: boolean
  autofaktura: boolean
}

export interface KundegruppeCreate {
  gruppe: string
  webshop: boolean
  autofaktura: boolean
}

export interface KundegruppeUpdate {
  gruppe?: string
  webshop?: boolean
  autofaktura?: boolean
}

export const kundegruppeApi = {
  list: async (): Promise<Kundegruppe[]> => {
    const response = await apiClient.get('/v1/kunde-gruppe/')
    return response.data
  },

  get: async (id: number): Promise<Kundegruppe> => {
    const response = await apiClient.get(`/v1/kunde-gruppe/${id}`)
    return response.data
  },

  create: async (data: KundegruppeCreate): Promise<Kundegruppe> => {
    const response = await apiClient.post('/v1/kunde-gruppe/', data)
    return response.data
  },

  update: async (id: number, data: KundegruppeUpdate): Promise<Kundegruppe> => {
    const response = await apiClient.put(`/v1/kunde-gruppe/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/kunde-gruppe/${id}`)
  }
}