import { createCrudApi, BaseListParams } from './base'

export interface CombinedDishRecipeComponent {
  kalkylekode: number
  amount_grams: number
}

export interface CombinedDishProductComponent {
  produktid: number
  amount_grams: number
}

export interface CombinedDishCreate {
  name: string
  recipes: CombinedDishRecipeComponent[]
  products: CombinedDishProductComponent[]
}

export interface CombinedDishRecipeComponentResponse {
  id: number
  kalkylekode: number
  kalkylenavn: string
  amount_grams: number
}

export interface CombinedDishProductComponentResponse {
  id: number
  produktid: number
  produktnavn: string
  visningsnavn?: string | null
  amount_grams: number
}

export interface CombinedDish {
  id: number
  name: string
  created_at: string
  updated_at: string
  created_by_user_id?: number | null
  recipe_components: CombinedDishRecipeComponentResponse[]
  product_components: CombinedDishProductComponentResponse[]
}

export interface CombinedDishListParams extends BaseListParams {
  search?: string
}

/**
 * API klient for kombinerte retter
 */
export const combinedDishesApi = createCrudApi<CombinedDish, CombinedDishCreate, CombinedDishListParams>({
  endpoint: '/v1/combined-dishes'
})
