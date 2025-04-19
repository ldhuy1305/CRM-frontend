import type { NamedObject } from '@/types/leads/lead'
import api from '../api'
import { BaseRepository } from '../base'

class IndustryRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'industries')
  }
}

export const industryRepository = new IndustryRepository()
