import type { Call, CallCreateEditPayload } from '@/types/calls/call'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class CallRepository extends BaseRepository<Call, CallCreateEditPayload> {
  constructor() {
    super(api, 'calls')
  }
}

class CallPurposeRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'calls/purposes')
  }
}

class CallResultRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'calls/results')
  }
}

class CallTypeRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'calls/types')
  }
}

export const callRepository = new CallRepository()
export const callPurposeRepository = new CallPurposeRepository()
export const callResultRepository = new CallResultRepository()
export const callTypeRepository = new CallTypeRepository()
