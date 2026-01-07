import { Leverandor } from '@/types/models'
import { createCrudApi, BaseListParams, BaseListResponse } from './base'

export interface LeverandorListParams extends BaseListParams {
  aktiv?: boolean
  search?: string
}

export type LeverandorListResponse = BaseListResponse<Leverandor>

// CreateData type - omit id and leverandorid since they are server-generated
export type LeverandorCreateData = Omit<Leverandor, 'id' | 'leverandorid' | 'ssma_timestamp'>

// Bruk generisk CRUD factory
export const leverandorerApi = createCrudApi<Leverandor, LeverandorCreateData, LeverandorListParams>({
  endpoint: '/v1/leverandorer'
})
