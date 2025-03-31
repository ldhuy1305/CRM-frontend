import { useToast } from 'vue-toastification'
const toast = useToast()
export class WebSocketClient {
  private socket: WebSocket | null = null
  connect() {
    this.socket = new WebSocket('ws://localhost:8000/ws/notifications/')
    this.socket.onopen = () => console.log('WebSocket connected')
    this.socket.onmessage = (event) => this.handleMessage(event)
    this.socket.onclose = () => console.log('WebSocket disconnected')
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
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
