import type { Account } from '@/types/accounts/account'
import type { Contact } from '@/types/contacts/contact'
import type { Deal } from '@/types/deals/deal'
import type { Lead } from '@/types/leads/lead'
import type { UserInfo } from '@/types/users/user'

export interface CallType {
  id: number
  name: string
}

export interface CallPurpose {
  id: number
  name: string
}

export interface CallResult {
  id: number
  name: string
}

export interface Call {
  id: number
  created_by: UserInfo
  updated_by: UserInfo | null
  call_type: CallType
  call_purpose: CallPurpose
  call_result: CallResult
  call_owner: UserInfo
  related_deal: Deal | null
  related_account: Account | null
  lead: Lead | null
  contact: Contact | null
  created_at: string
  updated_at: string
  title: string
  description: string
  voice_recording: string
  call_agenda: string
  start_time: string
  duration: number
  is_remind: boolean
}

export type CallCreateEditPayload = Omit<
  Call,
  | 'id'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at'
  | 'call_type'
  | 'call_purpose'
  | 'call_result'
  | 'call_owner'
  | 'related_deal'
  | 'related_account'
  | 'lead'
  | 'contact'
> & {
  call_type: number
  call_purpose: number | null
  call_result: number | null
  call_owner: number
  related_deal: number | null
  related_account: number | null
  lead: number | null
  contact: number | null
  voice_recording: string
  call_agenda: string
}
