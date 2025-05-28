<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add Participants</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Participant</label>
          <select v-model="selectedType">
            <option value="" disabled>Select Participant</option>
            <option value="lead">Lead</option>
            <option value="contact">Contact</option>
            <option value="user">User</option>
          </select>
        </div>

        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search participants..."
            @input="filterParticipants"
          />
        </div>

        <div class="participants-list">
          <template v-if="selectedType === 'lead'">
            <div
              v-for="lead in filteredParticipants"
              :key="'lead-' + lead.id"
              class="participant-item"
            >
              <input
                type="checkbox"
                :checked="isParticipantSelected(lead)"
                @change="toggleParticipant(lead)"
              />
              <div class="participant-info">
                <div class="name">{{ lead.first_name }} {{ lead.last_name }}</div>
                <div class="email">{{ lead.email }}</div>
              </div>
            </div>
          </template>

          <template v-if="selectedType === 'contact'">
            <div
              v-for="contact in filteredParticipants"
              :key="'contact-' + contact.id"
              class="participant-item"
            >
              <input
                type="checkbox"
                :checked="isParticipantSelected(contact)"
                @change="toggleParticipant(contact)"
              />
              <div class="participant-info">
                <div class="name">{{ contact.first_name }} {{ contact.last_name }}</div>
                <div class="email">{{ contact.email }}</div>
              </div>
            </div>
          </template>

          <template v-if="selectedType === 'user'">
            <div
              v-for="user in filteredParticipants"
              :key="'user-' + user.id"
              class="participant-item"
            >
              <input
                type="checkbox"
                :checked="isParticipantSelected(user)"
                @change="toggleParticipant(user)"
              />
              <div class="participant-info">
                <div class="name">{{ user.first_name }} {{ user.last_name }}</div>
                <div class="email">{{ user.email }}</div>
              </div>
            </div>
          </template>

          <template v-if="selectedType && !filteredParticipants.length">
            <div class="no-participants">No participants found.</div>
          </template>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn-primary" @click="handleSave">Add Selected</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contactRepository, leadRepository, userRepository } from '@/services'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  existingParticipants: any[] // Add this prop
}>()

const emit = defineEmits(['close', 'add-participants'])

const selectedType = ref('')
const searchQuery = ref('')
const participants = ref<any[]>([])
const selectedParticipants = ref<any[]>([]) // This will store ALL selected participants
const currentTypeSelections = ref<any[]>([]) // This will store current type selections
const filteredParticipants = ref<any[]>([])

const fetchParticipants = async (type: string) => {
  try {
    let response
    switch (type) {
      case 'lead':
        response = await leadRepository.show()
        break
      case 'contact':
        response = await contactRepository.show()
        break
      case 'user':
        response = await userRepository.show()
        break
      default:
        response = { results: [] }
    }
    participants.value = response.results || response
    filterParticipants()
  } catch (error) {
    console.error('Error fetching participants:', error)
  }
}

const filterParticipants = () => {
  if (!searchQuery.value) {
    filteredParticipants.value = participants.value
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredParticipants.value = participants.value.filter((item: any) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase()
    return fullName.includes(query) || item.email.toLowerCase().includes(query)
  })
}

watch(selectedType, (newType) => {
  if (newType) {
    fetchParticipants(newType)
    // Get existing participants of current type
    currentTypeSelections.value = selectedParticipants.value.filter((p) => p.type === newType)
  }
})

const isParticipantSelected = (participant: any) => {
  return selectedParticipants.value.some(
    (p) => p.id === participant.id && p.type === selectedType.value,
  )
}

const toggleParticipant = (participant: any) => {
  const participantData = {
    id: participant.id,
    type: selectedType.value,
    email: participant.email,
    name: `${participant.first_name} ${participant.last_name}`,
  }

  const existingIndex = selectedParticipants.value.findIndex(
    (p) => p.id === participant.id && p.type === selectedType.value,
  )

  if (existingIndex === -1) {
    // Add new participant
    selectedParticipants.value = [...selectedParticipants.value, participantData]
  } else {
    // Remove participant
    selectedParticipants.value = selectedParticipants.value.filter(
      (p, index) => index !== existingIndex,
    )
  }
}

onMounted(() => {
  // Initialize with existing participants from props
  selectedParticipants.value = [...props.existingParticipants]
})

const handleSave = () => {
  emit('add-participants', selectedParticipants.value)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.search-box {
  margin-bottom: 16px;
}

.participants-list {
  max-height: 400px;
  overflow-y: auto;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}

.participant-info {
  flex: 1;
}

.name {
  font-weight: 500;
}

.email {
  font-size: 0.9em;
  color: #666;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.no-participants {
  text-align: center;
  color: #999;
  padding: 16px 0;
}
</style>
