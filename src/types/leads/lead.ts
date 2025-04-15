interface NamedObject {
  id: number
  name: string
}

interface UserReference {
  id: number
  first_name: string
  last_name: string
  address?: string
  phone?: string
}

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
  lead_owner: UserReference
  lead_source: NamedObject
  lead_status: NamedObject
  industry: NamedObject
  created_by: UserReference
  updated_by: UserReference | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at: string | null
}

export type LeadRequest = Omit<
  Lead,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at'
>
