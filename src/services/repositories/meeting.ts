import type { Meeting, MeetingCreateEditPayload } from '@/types/meetings/meeting'
import api from '../api'
import { BaseRepository } from '../base'

class MeetingRepository extends BaseRepository<Meeting, MeetingCreateEditPayload> {
  constructor() {
    super(api, 'meetings')
  }

  async exportExcel(queryParams: string): Promise<Blob> {
    try {
      const response = await api.get(`/meetings/export-excel/?${queryParams}`, {
        responseType: 'blob',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout for large exports
      })

      return response.data
    } catch (error) {
      console.error('Export Meeting Excel API error:', error)
      throw error
    }
  }
}

export const meetingRepository = new MeetingRepository()
