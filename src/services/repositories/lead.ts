import type { ApiResponseList } from '@/types/api'
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

  // Get today's leads
  async getTodayLeads(): Promise<ApiResponseList<Lead>> {
    const today = new Date().toISOString().split('T')[0]
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { created_date: today },
      })
      return response.data
    } catch (error: any) {
      throw new Error("Failed to fetch today's leads")
    }
  }

  // Get leads grouped by status
  async getLeadsByStatus(): Promise<ApiResponseList<Lead>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { group_by: 'status' },
      })
      return response.data
    } catch (error: any) {
      throw new Error('Failed to fetch leads by status')
    }
  }

  // Get leads grouped by source
  async getLeadsBySource(): Promise<ApiResponseList<Lead>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { group_by: 'source' },
      })
      return response.data
    } catch (error: any) {
      throw new Error('Failed to fetch leads by source')
    }
  }

  // Get leads grouped by owner
  async getLeadsByOwner(): Promise<ApiResponseList<Lead>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { group_by: 'owner' },
      })
      return response.data
    } catch (error: any) {
      throw new Error('Failed to fetch leads by owner')
    }
  }

  // Get leads grouped by industry
  async getLeadsByIndustry(): Promise<ApiResponseList<Lead>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { group_by: 'industry' },
      })
      return response.data
    } catch (error: any) {
      throw new Error('Failed to fetch leads by industry')
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
