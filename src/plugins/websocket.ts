import { useToast } from 'vue-toastification'
const toast = useToast()
export class WebSocketClient {
  private socket: WebSocket | null = null
  private userId: string
  constructor(userId: string) {
    this.userId = userId
  }
  connect() {
    this.socket = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/ws/notifications/${this.userId}/`,
    )

    this.socket.onopen = () => {
      console.log(`WebSocket connected for user ${this.userId}`)
    }

    this.socket.onmessage = (event) => this.handleMessage(event)

    this.socket.onclose = () => {
      console.log(`WebSocket disconnected for user ${this.userId}`)
    }

    this.socket.onerror = (error) => {
      console.error(`WebSocket error for user ${this.userId}:`, error)
    }
  }
  handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data)
    console.log('New notification:', data.notification)
    toast.success(data.type, {
      icon: '✅',
    })
  }

  disconnect() {
    this.socket?.close()
  }
}
