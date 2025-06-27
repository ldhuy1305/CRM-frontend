import type { Account, AccountCreateEditPayload } from '@/types/accounts/account'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class AccountRepository extends BaseRepository<Account, AccountCreateEditPayload> {
  constructor() {
    super(api, 'accounts')
  }

  async exportExcel(queryParams: string): Promise<Blob> {
    try {
      const response = await api.get(`/accounts/export-excel/?${queryParams}`, {
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
      console.error('Export Account Excel API error:', error)
      throw error
    }
  }
}

class AccountTypeRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'accounts/types')
  }
}

class RatingRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'accounts/ratings')
  }
}

export const accountRepository = new AccountRepository()
export const accountTypeRepository = new AccountTypeRepository()
export const ratingRepository = new RatingRepository()
