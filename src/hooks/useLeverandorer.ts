import { Leverandor } from '@/types/models'
import { leverandorerApi, LeverandorCreateData, LeverandorListParams } from '@/lib/api/leverandorer'
import { createEntityCrudHooks } from './useEntityCrud'

// Lag type-safe hooks med konsistent error handling og toast-meldinger
const hooks = createEntityCrudHooks<Leverandor, LeverandorCreateData, LeverandorListParams>({
  entityName: 'leverandorer',
  displayName: {
    singular: 'Leverandør',
    plural: 'Leverandører'
  },
  api: leverandorerApi,
  getId: (leverandor) => leverandor.leverandorid,
  getDisplayName: (leverandor) => leverandor.leverandornavn || 'Leverandør'
})

// Eksporter hooks med forventede navn
export const useLeverandorerList = hooks.useList
export const useLeverandor = hooks.useGet
export const useCreateLeverandor = hooks.useCreate
export const useUpdateLeverandor = hooks.useUpdate
export const useDeleteLeverandor = hooks.useDelete
