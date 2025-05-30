export const formatVNDCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatDateTime = (datetime?: string) => {
  if (!datetime) return '—'
  return new Date(datetime).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatSecondsToMinutes = (duration: number) => {
  if (duration < 60) {
    return duration + ' seconds'
  }
  return Math.floor(duration / 60) + ' minutes'
}

export const formatDateTimeLocal = (dateString: string): string => {
  if (!dateString) return ''

  const date = new Date(dateString)

  const tzOffset = date.getTimezoneOffset()

  const localDate = new Date(date.getTime() - tzOffset * 60000)

  return localDate.toISOString().slice(0, 16)
}
