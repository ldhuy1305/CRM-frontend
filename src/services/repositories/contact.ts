import type { Contact, ContactCreateEditPayload } from '@/types/contacts/contact'
import api from '../api'
import { BaseRepository } from '../base'

class ContactRepository extends BaseRepository<Contact, ContactCreateEditPayload> {
  constructor() {
    super(api, 'contacts')
  }

  async exportExcel(queryParams: string): Promise<Blob> {
    try {
      const response = await api.get(`/contacts/export-excel/?${queryParams}`, {
        responseType: 'blob',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      })

      return response.data
    } catch (error) {
      console.error('Export Contact Excel API error:', error)
      throw error
    }
  }
}

export const contactRepository = new ContactRepository()
