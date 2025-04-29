import type { NamedObject } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { UserInfo } from '@/types/users/user'

export interface Account {
  id: number
  name: string
  phone: string | null
  fax: string | null
  website: string | null
  tax_code: string | null
  employees: number | null
  avatar: string
  annual_revenue: string
  street: string
  country: string
  city: string
  state_province: string
  postal_code: string
  description: string
  convert_from: number

  // Relationships
  account_owner: UserInfo
  account_type: NamedObject | null
  rating: NamedObject | null
  industry: NamedObject | null
  contacts: Contact[]

  // Audit fields
  created_by: UserInfo
  updated_by: UserInfo | null
  created_at: string
  updated_at: string
}

// For create/update operations
export type AccountCreateEditPayload = Omit<
  Account,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
  | 'contacts'
  | 'avatar'
  | 'account_owner'
  | 'account_type'
  | 'rating'
  | 'industry'
  | 'convert_from'
> & {
  account_owner: number | null
  account_type: number | null
  rating: number | null
  industry: number | null
}
