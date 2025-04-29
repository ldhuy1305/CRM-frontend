<template>
  <div class="crm-select">
    <label v-if="label" class="select-label">{{ label }}</label>
    <div class="select-wrapper">
      <input
        v-model="searchText"
        class="search-input"
        type="text"
        :placeholder="placeholder"
        @focus="openDropdown = true"
        @click.stop
      />
      <span class="dropdown-icon" @click="toggleDropdown">▼</span>

      <div v-if="openDropdown" class="dropdown">
        <div class="dropdown-list">
          <div
            v-if="filteredOptions.length"
            v-for="option in filteredOptions"
            :key="option.id"
            class="dropdown-item"
            @click="selectOption(option)"
          >
            {{ option.name }}
          </div>
          <div v-else class="no-options">Rất tiếc, không có lựa chọn nào phù hợp.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array as () => { id: number; name: string }[],
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Select...',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const openDropdown = ref(false)
const searchText = ref('')
const selectedLabel = ref('')

watch(
  () => props.modelValue,
  (newVal) => {
    const selected = props.options.find((opt) => opt.id === newVal)
    if (selected) {
      searchText.value = selected.name
      selectedLabel.value = selected.name
    } else {
      searchText.value = ''
      selectedLabel.value = ''
    }
  },
  { immediate: true },
)

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options
  return props.options.filter((option) =>
    option.name.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

function toggleDropdown(event: Event) {
  event.stopPropagation()
  openDropdown.value = !openDropdown.value
}

function selectOption(option: { id: number; name: string }) {
  emit('update:modelValue', option.id)
  emit('change', option.id)
  searchText.value = option.name
  selectedLabel.value = option.name
  openDropdown.value = false
}
</script>

<style scoped>
.crm-select {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px 0px;
}

.select-label {
  font-size: 14px;
  margin-bottom: 4px;
  color: #1a3353;
  font-weight: 600;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0;
  border-radius: 6px;
  background-color: #fff;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 14px;
}

.dropdown-icon {
  padding: 0 12px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  z-index: 1000;
  max-height: 220px;
  overflow-y: auto;
  border-radius: 0 0 6px 6px;
  width: 100%;
}

.dropdown-list {
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.no-options {
  padding: 12px;
  text-align: center;
  color: #888;
  font-size: 13px;
}
</style>
