import type { NamedObject } from '@/types/common/common_types'
import type { Lead, LeadConvertPayload, LeadCreateEditPayload } from '@/types/leads/lead'
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
    super(api, 'leads/sources')
  }
}

class LeadStatusRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'leads/statuses')
  }
}

class IndustryRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'leads/industries')
  }
}

export const leadRepository = new LeadRepository()
export const leadSourceRepository = new LeadSourceRepository()
export const leadStatusRepository = new LeadStatusRepository()
export const industryRepository = new IndustryRepository()
