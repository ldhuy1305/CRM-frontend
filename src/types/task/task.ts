import type { NamedObject } from '@/types/common/common_types'
import type { UserInfo } from '@/types/users/user'
import type { Account } from '../accounts/account'
import type { Campaign } from '../campaigns/campaign'
import type { Contact } from '../contacts/contact'
import type { Deal } from '../deals/deal'
import type { Lead } from '../leads/lead'

export interface Task {
  id: 1
  created_by: UserInfo
  updated_by: UserInfo
  task_owner: UserInfo
  lead: Lead
  contact: Contact
  related_account: Account
  related_deal: Deal
  priority: NamedObject
  status: NamedObject
  created_at: string
  updated_at: string
  title: string
  due_date: string | null
  is_remind: boolean
  is_repeat: boolean
  is_completed: boolean
  description: string
  related_campaign: Campaign
}

export type TaskCreateEditPayload = Omit<
  Task,
  | 'id'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at'
  | 'lead'
  | 'contact'
  | 'related_account'
  | 'related_deal'
  | 'related_campaign'
  | 'priority'
  | 'status'
  | 'task_owner'
> & {
  task_owner: number
  lead: number | null
  contact: number | null
  related_account: number | null
  related_deal: number | null
  related_campaign: number | null
  priority: number
  status: number
}
