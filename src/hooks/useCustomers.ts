import { Customer } from '@/types/models'
import { customersApi, CustomerListParams } from '@/lib/api/customers'
import { createEntityCrudHooks } from './useEntityCrud'

// Lag type-safe hooks med konsistent error handling og toast-meldinger
const hooks = createEntityCrudHooks<Customer, Omit<Customer, 'kundeid'>, CustomerListParams>({
  entityName: 'customers',
  displayName: {
    singular: 'Kunde',
    plural: 'Kunder'
  },
  api: customersApi,
  getId: (customer) => customer.kundeid,
  getDisplayName: (customer) => customer.kundenavn || 'Kunde'
})

// Eksporter hooks med forventede navn - Fra 119 linjer til 22 linjer!
export const useCustomersList = hooks.useList
export const useCustomer = hooks.useGet
export const useCreateCustomer = hooks.useCreate
export const useUpdateCustomer = hooks.useUpdate
export const useDeleteCustomer = hooks.useDelete
