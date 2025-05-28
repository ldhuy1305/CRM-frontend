import type { Account } from '../accounts/account'
import type { Campaign } from '../campaigns/campaign'
import type { Contact } from '../contacts/contact'
import type { Deal } from '../deals/deal'
import type { Lead } from '../leads/lead'
import type { UserInfo } from '../users/user'

export interface Participant {
  name: string
  email: string
}

export interface CreateParticipant {
  user: number | null
  contact: number | null
  lead: number | null
}

export interface Meeting {
  id: number
  created_by: UserInfo
  updated_by: UserInfo | null
  participants: Participant[]
  created_at: string
  updated_at: string
  title: string
  location: string
  from_datetime: string
  to_datetime: string
  is_all_day: boolean
  is_online_meeting: boolean
  host: number
  related_lead: Lead | null
  related_contact: Contact | null
  related_account: Account | null
  related_deal: Deal | null
  related_campaign: Campaign | null
}

export type MeetingCreateEditPayload = Omit<
  Meeting,
  | 'id'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at'
  | 'participants'
  | 'related_lead'
  | 'related_deal'
  | 'related_account'
  | 'related_contact'
  | 'related_campaign'
> & {
  related_lead: number | null
  related_account: number | null
  related_contact: number | null
  related_deal: number | null
  related_campaign: number | null
  participants: CreateParticipant[]
}
