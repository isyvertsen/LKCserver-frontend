import { Employee } from '@/types/models'
import { createCrudApi, BaseListParams, BaseListResponse } from './base'

export interface EmployeeListParams extends BaseListParams {
  aktiv?: boolean
  avdeling?: string
}

export type EmployeeListResponse = BaseListResponse<Employee>

// Bruk generisk CRUD factory - reduserer ~60 linjer duplicate kode
export const employeesApi = createCrudApi<Employee, Omit<Employee, 'id'>, EmployeeListParams>({
  endpoint: '/v1/ansatte'
})
