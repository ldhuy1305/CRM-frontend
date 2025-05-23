import type { Meeting, MeetingCreateEditPayload } from '@/types/meetings/meeting'
import api from '../api'
import { BaseRepository } from '../base'

class MeetingRepository extends BaseRepository<Meeting, MeetingCreateEditPayload> {
  constructor() {
    super(api, 'meetings')
  }
}

export const meetingRepository = new MeetingRepository()
