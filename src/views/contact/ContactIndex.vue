<template>
  <div class="page-container">
    <div class="module-header">
      <h1>Contacts</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateContact">Create Contact</button>
        <!-- <button class="actions-btn">
            Actions
            <span class="dropdown-arrow">▼</span>
          </button> -->
      </div>
    </div>

    <div class="table-pagination">
      <div class="rows-per-page">
        Records per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="pagination">
        <button class="nav-btn">&lt;</button>
        <span class="current-page">1</span>
        <button class="nav-btn">&gt;</button>
      </div>
    </div>

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <!-- <th class="checkbox-column"></th> -->
            <th>
              <!-- <input type="checkbox" />
                <span class="sort-icon">▼</span> -->
              <span>Contact Name</span>
            </th>
            <th>Account ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Contact Owner</th>
          </tr>
        </thead>
        <tbody v-if="contacts.length != 0">
          <tr v-for="contact in contacts" :key="contact.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(contact.id)">⋮</button>
                  <div v-if="activeMoreOptions === contact.id" class="options-dropdown">
                    <div @click="navigateToEditContact(contact.id)">Edit</div>
                    <div>Send Email</div>
                    <div>Create Task</div>
                    <div @click="deleteContact(contact.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <!-- <td class="checkbox-column"> -->
            <td>
              <!-- <input type="checkbox" /> -->
              <span @click="navigateTocontactDetails(contact.id)"
                >{{ contact.last_name }} {{ contact.first_name }}</span
              >
            </td>
            <td>{{ contact.account }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.contact_owner?.last_name }} {{ contact.contact_owner?.first_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" style="text-align: center">No contacts found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contactRepository } from '@/services'
import '@/styles/shared/index.css'
import type { Contact } from '@/types/contacts/contact'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const contacts = ref<Contact[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)

const fetchContacts = async () => {
  try {
    const res = await contactRepository.show()
    console.log('✅ API Response:', res)
    console.log('📦 Fetched contacts:', res.results)
    contacts.value = res.results
  } catch (error) {
    console.error('❌ Error fetching contacts:', error)
  }
}

const navigateToCreateContact = () => {
  router.push('/contacts/create')
}

const navigateTocontactDetails = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const navigateToEditContact = (contactId: number) => {
  router.push(`/contacts/${contactId}/edit`)
}

const toggleMoreOptions = (contactId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === contactId ? null : contactId
}

const deleteContact = async (contactId: number) => {
  if (!confirm('Confirm to delete this contact?')) {
    return
  }

  try {
    await contactRepository.destroy(contactId)
    console.log('✅ contact deleted successfully:', contactId)
    await fetchContacts()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting contact:', error)
    alert('Failed to delete contact. Please try again.')
  }
}

onMounted(() => {
  fetchContacts()
})

watch(rowsPerPage, () => {
  fetchContacts()
})
</script>
