import type { Campaign, CampaignCreateEditPayload } from '@/types/campaigns/campaign'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class CampaignRepository extends BaseRepository<Campaign, CampaignCreateEditPayload> {
  constructor() {
    super(api, 'campaigns')
  }
}

class CampaignTypeRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'campaigns/types')
  }
}

class CampaignStatusRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'campaigns/status')
  }
}

export const campaignRepository = new CampaignRepository()
export const campaignTypeRepository = new CampaignTypeRepository()
export const campaignStatusRepository = new CampaignStatusRepository()
