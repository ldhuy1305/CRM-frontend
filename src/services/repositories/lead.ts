// src/services/repositories/lead.repository.ts

import type { Lead, LeadRequest } from '@/types/leads/lead'
import api from '../api'
import { BaseRepository } from '../base'

class LeadRepository extends BaseRepository<Lead, LeadRequest> {
  constructor() {
    super(api, 'leads')
  }
}

export const leadRepository = new LeadRepository()
