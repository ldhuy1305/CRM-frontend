import type {
  Lead,
  LeadConvertPayload,
  LeadCreateEditPayload,
  NamedObject,
} from '@/types/leads/lead'
import api from '../api'
import { BaseRepository } from '../base'

class LeadRepository extends BaseRepository<Lead, LeadCreateEditPayload> {
  constructor() {
    super(api, 'leads')
  }

  async convert(leadId: number, payload: LeadConvertPayload): Promise<any> {
    try {
      const response = await this.$axios.post(`${this.resource}/${leadId}/convert/`, payload)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Lead conversion failed'
      throw new Error(message)
    }
  }
}
class LeadSourceRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'lead-sources')
  }
}

class LeadStatusRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'lead-statuses')
  }
}

export const leadRepository = new LeadRepository()
export const leadSourceRepository = new LeadSourceRepository()
export const leadStatusRepository = new LeadStatusRepository()
