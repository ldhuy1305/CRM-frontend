<template>
  <button :class="['ui-button', variantClass]" @click="$emit('click')">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'UiButton',
  props: {
    variant: {
      type: String as () => 'primary' | 'danger' | 'cancel',
      default: 'primary',
    },
  },
  emits: ['click'],
  setup(props) {
    const variantClass = computed(() => {
      if (props.variant === 'danger') return 'btn-danger'
      if (props.variant === 'cancel') return 'btn-cancel'
      return 'btn-primary'
    })

    return {
      variantClass,
    }
  },
})
</script>

<style scoped>
.ui-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.btn-primary {
  background-color: #1a3353;
}

.btn-danger {
  background-color: #ff4d00;
}

.btn-cancel {
  background-color: #ff4d4d; /* Màu yêu cầu */
}
</style>
