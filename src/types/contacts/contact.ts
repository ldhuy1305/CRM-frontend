import type { NamedObject } from '@/types/common/common_types'
import type { UserInfo } from '@/types/users/user'
import type { Account } from '../accounts/account'

export interface Contact {
  id: number
  first_name: string
  last_name: string
  company: string
  email: string
  phone: string
  website: string
  fax: string
  department: string
  birthday: string
  assistant_name: string
  assistant_phone: string
  avatar: string
  is_email_opt_out: boolean
  is_call_opt_out: boolean
  street: string
  country: string
  city: string
  state_province: string
  postal_code: string
  description: string
  account: Account
  contact_owner: UserInfo
  lead_source: NamedObject
  created_by: UserInfo
  updated_by: UserInfo | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at: string | null
}

export type ContactRequest = Omit<
  Contact,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at'
>

export type ContactCreateEditPayload = Omit<
  Contact,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
  | 'is_deleted'
  | 'deleted_at'
  | 'contact_owner'
  | 'lead_source'
  | 'account'
> & {
  account: number
  contact_owner: number | null
  lead_source: number | null
}
