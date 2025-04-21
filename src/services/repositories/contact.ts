import type { Contact, ContactCreateEditPayload } from '@/types/contacts/contact'
import api from '../api'
import { BaseRepository } from '../base'

class ContactRepository extends BaseRepository<Contact, ContactCreateEditPayload> {
  constructor() {
    super(api, 'contacts')
  }
}

export const contactRepository = new ContactRepository()
