import type { UserInfo } from '../users/user'

export interface Participant {
  name: string
  email: string
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
}

export type MeetingCreateEditPayload = Omit<
  Meeting,
  'id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'
>
