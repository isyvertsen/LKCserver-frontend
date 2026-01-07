import { Kategori, kategorierApi, KategoriCreateData, KategoriListParams } from '@/lib/api/kategorier'
import { createEntityCrudHooks } from './useEntityCrud'

// Lag type-safe hooks med konsistent error handling og toast-meldinger
const hooks = createEntityCrudHooks<Kategori, KategoriCreateData, KategoriListParams>({
  entityName: 'kategorier',
  displayName: {
    singular: 'Kategori',
    plural: 'Kategorier'
  },
  api: kategorierApi,
  getId: (kategori) => kategori.kategoriid,
  getDisplayName: (kategori) => kategori.kategori || 'Kategori'
})

// Eksporter hooks med forventede navn
export const useKategorierList = hooks.useList
export const useKategori = hooks.useGet
export const useCreateKategori = hooks.useCreate
export const useUpdateKategori = hooks.useUpdate
export const useDeleteKategori = hooks.useDelete
