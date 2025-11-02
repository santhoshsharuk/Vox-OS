// Notification Manager
export class NotificationManager {
  private notifications: HTMLElement[] = []

  constructor() {
    // Nothing to initialize
  }

  show(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const container = document.getElementById('notifications')!
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`

    const icon = this.getIcon(type)
    
    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">✕</button>
    `

    container.appendChild(notification)
    this.notifications.push(notification)

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10)

    // Close button
    notification.querySelector('.notification-close')?.addEventListener('click', () => {
      this.close(notification)
    })

    // Auto close after 5 seconds
    setTimeout(() => this.close(notification), 5000)
  }

  private close(notification: HTMLElement) {
    notification.classList.remove('show')
    setTimeout(() => {
      notification.remove()
      this.notifications = this.notifications.filter(n => n !== notification)
    }, 300)
  }

  private getIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }
    return icons[type] || 'ℹ️'
  }
}
