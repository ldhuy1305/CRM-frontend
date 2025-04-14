import api from '@/services/api'
import { BaseRepository } from '@/services/base'

export interface ApiNotification {
  id: number //ID for the notification
  title: string // The short title of notification
  message: string // The detailed message content
  timestamp: string // DateTime string
  is_read: boolean // True : read
  related_object_url?: string // URL to the related entity (Lead, Task, etc.)
}

export interface ApiNotificationListResponse {
  count: number // Total number of notifications available
  next: string | null // URL for the next page of results, or null
  previous: string | null // URL for the previous page of results, or null
  results: ApiNotification[] // An array containing the notification objects for the current page
}

export class NotificationRepository extends BaseRepository<ApiNotification> {
  constructor() {
    super(api, 'notifications')
  }
}
