import { createEntityCrudHooks } from './useEntityCrud'
import {
  CombinedDish,
  CombinedDishCreate,
  CombinedDishListParams,
  combinedDishesApi
} from '@/lib/api/combined-dishes'

/**
 * CRUD hooks for kombinerte retter (combined dishes)
 */
export const {
  useList: useCombinedDishesList,
  useGet: useCombinedDish,
  useCreate: useCreateCombinedDish,
  useUpdate: useUpdateCombinedDish,
  useDelete: useDeleteCombinedDish
} = createEntityCrudHooks<CombinedDish, CombinedDishCreate, CombinedDishListParams>({
  entityName: 'combined-dishes',
  displayName: {
    singular: 'Kombinert rett',
    plural: 'Kombinerte retter'
  },
  api: combinedDishesApi,
  getId: (dish) => dish.id,
  getDisplayName: (dish) => dish.name
})
