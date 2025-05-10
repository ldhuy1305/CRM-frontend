import type { Deal, DealCreateEditPayload, DealLostReason, Stage } from '@/types/deals/deal'
import api from '../api'
import { BaseRepository } from '../base'

class DealStageRepository extends BaseRepository<Stage, Partial<Stage>> {
  constructor() {
    super(api, 'deals/stage')
  }
}

class DealsRepository extends BaseRepository<Deal, DealCreateEditPayload> {
  constructor() {
    super(api, 'deals')
  }
}

class DealLostReasonRepository extends BaseRepository<DealLostReason, Partial<DealLostReason>> {
  constructor() {
    super(api, 'deals/lost-reasons')
  }
}

export const stageRepository = new DealStageRepository()
export const dealsRepository = new DealsRepository()
export const dealLostReasonRepository = new DealLostReasonRepository()
