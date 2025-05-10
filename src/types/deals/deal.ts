import type { Account } from '@/types/accounts/account'
import type { Campaign } from '@/types/campaigns/campaign'
import type { NamedObject } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { UserInfo } from '@/types/users/user'

export interface Stage {
  id: number
  name: string
  probability: number
}

export interface StageHistory {
  id: number
  created_at: string
  updated_at: string
  amount: number
  probability: number
  expected_revenue: number
  stage_duration: number
  created_by: number
  updated_by: number | null
  stage: number
  deal: number
}

export interface Deal {
  id: number
  created_by: UserInfo
  updated_by: UserInfo | null
  deal_owner: UserInfo
  account: Account
  contact: Contact
  stage: Stage
  lost_reason: NamedObject | null
  stage_histories: StageHistory[]
  created_at: string
  updated_at: string
  name: string
  close_date: string
  amount: number
  probability: number
  expected_revenue: number
  is_lost: boolean
  description: string
  campaign: Campaign | null
}

export interface DealLostReason {
  id: number
  reason: string
}

export type DealCreateEditPayload = Omit<
  Deal,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
  | 'stage_histories'
  | 'deal_owner'
  | 'account'
  | 'contact'
  | 'stage'
  | 'lost_reason'
  | 'campaign'
> & {
  deal_owner: number
  account: number
  contact: number | null
  stage: number
  campaign: number | null
  lost_reason: number | null
}
