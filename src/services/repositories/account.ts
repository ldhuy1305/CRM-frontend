import type { Account, AccountCreateEditPayload } from '@/types/accounts/account'
import type { NamedObject } from '@/types/common/common_types'
import api from '../api'
import { BaseRepository } from '../base'

class AccountRepository extends BaseRepository<Account, AccountCreateEditPayload> {
  constructor() {
    super(api, 'accounts')
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
