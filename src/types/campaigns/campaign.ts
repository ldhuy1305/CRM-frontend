import type { NamedObject } from '@/types/common/common_types'
import type { UserInfo } from '@/types/users/user'

export interface Campaign {
  id: number
  created_by: UserInfo
  updated_by: UserInfo | null
  campaign_type: NamedObject
  campaign_status: NamedObject
  campaign_owner: UserInfo
  created_at: string
  updated_at: string
  name: string
  description: string
  start_date: string
  end_date: string
  expected_revenue: string
  budgeted_cost: string
  actual_cost: string
  expected_response: number
  numbers_sent: number
}

export type CampaignCreateEditPayload = Omit<
  Campaign,
  | 'id'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at'
  | 'campaign_type'
  | 'campaign_status'
  | 'campaign_owner'
> & {
  campaign_type: number
  campaign_status: number
  campaign_owner: number
}
