<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="calendar-container">
    <CRMLoading :loading="isLoading" />
    <div class="calendar-header">
      <h1>Calendar</h1>
      <div class="calendar-controls">
        <button @click="previousMonth" class="nav-btn">
          <fas-icon icon="chevron-left" />
        </button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="nav-btn">
          <fas-icon icon="chevron-right" />
        </button>
      </div>
      <div class="view-controls">
        <button @click="goToToday" class="today-btn">Today</button>
      </div>
    </div>

    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-color call"></div>
        <span>Calls</span>
      </div>
      <div class="legend-item">
        <div class="legend-color meeting"></div>
        <span>Meetings</span>
      </div>
    </div>

    <!-- Month View -->
    <div v-if="currentView === 'month'" class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>

      <div class="calendar-days">
        <div
          v-for="day in calendarDays"
          :key="`${day.date}-${day.month}`"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            today: day.isToday,
            'has-events': day.events.length > 0,
          }"
        >
          <div class="day-number">{{ day.date }}</div>
          <div class="day-events">
            <div
              v-for="event in day.events.slice(0, 3)"
              :key="event.id"
              class="event"
              :class="event.type"
              @click.stop="openEvent(event)"
            >
              <span class="event-time">{{ formatTime(event.start_time) }}</span>
              <span class="event-title">{{ event.title }}</span>
            </div>
            <div v-if="day.events.length > 3" class="more-events">
              +{{ day.events.length - 3 }} more
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <div v-if="showEventModal" class="modal-overlay" @click="closeEventModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedEvent?.title || 'New Event' }}</h3>
          <button @click="closeEventModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Date:</strong> {{ formatDate(selectedEvent?.start_time) }}</p>
          <p v-if="selectedEvent?.type === 'meeting'">
            <strong>Time:</strong> {{ formatTime(selectedEvent?.start_time) }} -
            {{ formatTime(selectedEvent?.end_time) }}
          </p>
          <p v-else-if="selectedEvent?.type === 'call'">
            <strong>Time:</strong> {{ formatTime(selectedEvent?.start_time) }}
          </p>
          <p v-if="selectedEvent?.description">
            <strong>Description:</strong> {{ selectedEvent.description }}
          </p>
          <p v-if="selectedEvent?.is_online_meeting"><strong>Type:</strong> Online Meeting</p>
          <p v-else-if="!selectedEvent?.is_online_meeting && selectedEvent?.type === 'meeting'">
            <strong>Type:</strong> In Person Meeting
          </p>
        </div>
        <div class="modal-actions">
          <button @click="detailEvent" class="today-btn">Details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { callRepository, meetingRepository } from '@/services'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentDate = ref(new Date())
const currentView = ref<'month' | 'week'>('month')
const events = ref<any[]>([])
const showEventModal = ref(false)
const selectedEvent = ref<any>(null)
const isLoading = ref(false)

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)

  const dayOfWeek = firstDay.getDay()
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(startDate.getDate() - mondayOffset)

  const days = []
  const currentDateObj = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const dayEvents = events.value.filter((event) => {
      if (!event.start_time) return false
      const eventDate = new Date(event.start_time)
      return eventDate.toDateString() === currentDateObj.toDateString()
    })

    days.push({
      date: currentDateObj.getDate(),
      month: currentDateObj.getMonth(),
      year: currentDateObj.getFullYear(),
      isCurrentMonth: currentDateObj.getMonth() === month,
      isToday: currentDateObj.toDateString() === new Date().toDateString(),
      events: dayEvents,
      fullDate: new Date(currentDateObj),
    })

    currentDateObj.setDate(currentDateObj.getDate() + 1)
  }

  return days
})

const fetchEvents = async () => {
  try {
    isLoading.value = true
    const [meetingsRes, callsRes] = await Promise.all([
      meetingRepository.show({}),
      callRepository.show({}),
    ])

    const meetings = (meetingsRes.results || []).map((meeting) => ({
      ...meeting,
      type: 'meeting',
      start_time: meeting.from_datetime,
      end_time: meeting.to_datetime,
    }))

    console.log('Meetings loaded:', meetings)

    const calls = (callsRes.results || []).map((call) => ({
      ...call,
      type: 'call',
    }))

    console.log('Calls loaded:', calls)

    events.value = [...meetings, ...calls]
    console.log('Total events loaded:', events.value.length)
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    isLoading.value = false
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const openEvent = (event: any) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const goToToday = () => {
  currentDate.value = new Date()
}

const detailEvent = () => {
  if (selectedEvent.value) {
    if (selectedEvent.value.type === 'meeting') {
      router.push(`/meetings/${selectedEvent.value.id}`)
    } else if (selectedEvent.value.type === 'call') {
      router.push(`/calls/${selectedEvent.value.id}`)
    }
  }
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US')
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: black;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.calendar-controls h2 {
  margin: 0;
  font-size: 24px;
  width: 200px;
  text-align: center;
}

.nav-btn {
  /* background: #1a3863; */
  color: navy;
  border: navy 1px solid;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.view-controls button {
  /* background: #f8f9fa; */
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  margin-left: 5px;
  cursor: pointer;
}

.view-controls button.active {
  background: #007bff;
  color: white;
}

.today-btn {
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  font-weight: 500;
  background-color: #1a3863;
}

.calendar-grid {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.weekday {
  padding: 12px;
  text-align: center;
  font-weight: 600;
  border-right: 1px solid #dee2e6;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 120px;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
  cursor: pointer;
  position: relative;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.other-month {
  color: #6c757d;
  background: #f8f9fa;
}

.calendar-day.today {
  background: #fff3cd;
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.event {
  background: #007bff;
  color: white;
  padding: 2px 4px;
  margin: 1px 0;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  gap: 4px;
}

.event.meeting,
.legend-color.meeting {
  background: #2775c7;
}

.event.call,
.legend-color.call {
  background: #ff6500;
}

.more-events {
  font-size: 10px;
  color: #6c757d;
  margin-top: 2px;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 3px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.week-view {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.week-header {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.week-day-header {
  padding: 12px;
  text-align: center;
  border-right: 1px solid #dee2e6;
}

.week-day-header.today {
  background: #e3f2fd;
}

.week-body {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
}

.week-times {
  border-right: 1px solid #dee2e6;
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid #dee2e6;
  padding: 4px;
  font-size: 12px;
  position: relative;
}

.week-day-column {
  border-right: 1px solid #dee2e6;
}

.week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  background: #007bff;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  z-index: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content p {
  margin: 10px 10px;
  color: #495057;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #495057;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
