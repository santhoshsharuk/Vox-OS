// Taskbar Component
import { UserSetup } from './user-setup'

export function createTaskbar() {
  const taskbar = document.getElementById('taskbar')!
  const userName = UserSetup.getUserName()
  const profilePicture = localStorage.getItem('voxos-profile-picture')
  
  // Determine user icon HTML
  const userIconHTML = profilePicture 
    ? `<img src="${profilePicture}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" />`
    : '👤'
  
  taskbar.innerHTML = `
    <div class="taskbar-left">
      <button class="start-button" id="start-btn">
        <img src="/assets/app/startbutton.png" alt="Start" class="start-icon" />
      </button>
      <div class="taskbar-apps" id="taskbar-apps"></div>
    </div>
    <div class="taskbar-center">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search or ask anything..." id="search-input" />
      </div>
    </div>
    <div class="taskbar-right">
      <div class="user-greeting" id="user-greeting" title="Logged in as ${userName}">
        <span class="user-icon">${userIconHTML}</span>
        <span class="user-name">${userName}</span>
      </div>
      <button class="taskbar-btn" id="voice-btn" title="Voice Assistant">
        <span>🎙️</span>
      </button>
      <button class="taskbar-btn" id="wifi-btn" title="Network">
        <span>📶</span>
      </button>
      <button class="taskbar-btn" id="volume-btn" title="Volume">
        <span>🔊</span>
      </button>
      <div class="clock" id="clock"></div>
      <button class="taskbar-btn" id="notifications-btn" title="Notifications">
        <span>🔔</span>
      </button>
    </div>
  `

  // Start button handler
  document.getElementById('start-btn')?.addEventListener('click', () => {
    document.getElementById('start-menu')?.classList.toggle('hidden')
  })

  // Voice button handler
  document.getElementById('voice-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('toggle-voice'))
  })

  // Search handler
  document.getElementById('search-input')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      const input = e.target as HTMLInputElement
      window.dispatchEvent(new CustomEvent('voice-command', { 
        detail: input.value 
      }))
      input.value = ''
    }
  })
}
