import { apiClient } from '@/lib/api-client'

export interface Kategori {
  kategoriid: number
  kategori: string
  beskrivelse: string | null
  ssma_timestamp: string | null
}

export const kategorierApi = {
  /**
   * List all kategorier
   */
  async list(): Promise<Kategori[]> {
    const response = await apiClient.get<Kategori[]>('/v1/kategorier/?limit=1000')
    return response.data
  },

  /**
   * Get a single kategori by ID
   */
  async get(id: number): Promise<Kategori> {
    const response = await apiClient.get<Kategori>(`/v1/kategorier/${id}`)
    return response.data
  },
}
