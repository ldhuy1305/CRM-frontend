import type { Account, AccountCreateEditPayload } from '@/types/accounts/account'
import type { ApiResponseList } from '@/types/api'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class AccountRepository extends BaseRepository<Account, AccountCreateEditPayload> {
  constructor() {
    super(api, 'accounts')
  }

  async getKeyAccounts(): Promise<ApiResponseList<Account>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { has_deals: true },
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch key accounts')
    }
  }

  async getAccountsByIndustry(): Promise<ApiResponseList<Account>> {
    try {
      const response = await this.$axios.get(`${this.resource}`, {
        params: { group_by: 'industry' },
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch accounts by industry')
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
