import type { NamedObject } from '@/types/common/common_types'
import type { UserInfo } from '@/types/users/user'

export interface Lead {
  id: number
  first_name: string
  last_name: string
  company_name: string
  email: string
  phone: string
  website: string
  fax: string
  avatar: string
  annual_revenue: string
  is_email_opt_out: boolean
  is_call_opt_out: boolean
  street: string
  country: string
  city: string
  state_province: string
  postal_code: string
  description: string
  lead_owner: UserInfo
  lead_source: NamedObject
  lead_status: NamedObject
  industry: NamedObject
  created_by: UserInfo
  updated_by: UserInfo | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at: string | null
  // owner_name: string
}

export type LeadRequest = Omit<
  Lead,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at'
>

export type LeadCreateEditPayload = Omit<
  Lead,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
  | 'is_deleted'
  | 'deleted_at'
  | 'avatar'
  | 'lead_owner'
  | 'lead_source'
  | 'lead_status'
  | 'industry'
> & {
  lead_owner: number | null
  lead_source: number | null
  lead_status: number | null
  industry: number | null
}

export interface LeadConvertPayload {
  account_owner: number
  is_create_deal: boolean
}
