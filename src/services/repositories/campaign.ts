import type { Campaign, CampaignCreateEditPayload } from '@/types/campaigns/campaign'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class CampaignRepository extends BaseRepository<Campaign, CampaignCreateEditPayload> {
  constructor() {
    super(api, 'campaigns')
  }

  // Get campaign target leads
  async getCampaignLeads(campaignId: number): Promise<any> {
    try {
      const response = await this.$axios.get(`${this.resource}/${campaignId}/leads/`)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign leads:', error)
      throw error
    }
  }

  // Get campaign target contacts
  async getCampaignContacts(campaignId: number): Promise<any> {
    try {
      const response = await this.$axios.get(`${this.resource}/${campaignId}/contacts/`)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign contacts:', error)
      throw error
    }
  }

  // Add leads to campaign
  async addLeadsToCampaign(campaignId: number, leadIds: number): Promise<any> {
    try {
      await this.$axios.post(`${this.resource}/${campaignId}/add/`, { lead: leadIds })
    } catch (error) {
      console.error('Error adding leads to campaign:', error)
      throw error
    }
  }

  // Add contacts to campaign
  async addContactsToCampaign(campaignId: number, contactIds: number): Promise<any> {
    try {
      await this.$axios.post(`${this.resource}/${campaignId}/add/`, { contact: contactIds })
    } catch (error) {
      console.error('Error adding contacts to campaign:', error)
      throw error
    }
  }
}

class CampaignTypeRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'campaigns/types')
  }
}

class CampaignStatusRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'campaigns/statuses')
  }
}

export const campaignRepository = new CampaignRepository()
export const campaignTypeRepository = new CampaignTypeRepository()
export const campaignStatusRepository = new CampaignStatusRepository()
