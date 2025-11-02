// Vox OS Initialization
import './types'
import { SplashScreen } from './splash'
import { createDesktop } from './desktop'
import { createTaskbar } from './taskbar'
import { createStartMenu } from './startmenu'
import { VoiceAssistant } from './voice'
// Offline voice assistant (optional - keeping Web Speech API for now)
import { WindowManager } from './windows'
import { NotificationManager } from './notifications'

export function initVoxOS() {
  // Show splash screen for 13 seconds
  new SplashScreen(() => {
    loadDesktop()
  })
}

function setupWhatsAppLauncher(_notificationManager: NotificationManager) {
  // Close app window event
  window.addEventListener('close-app', ((e: CustomEvent) => {
    const appId = e.detail
    const windowEl = document.getElementById(`window-${appId}`)
    if (windowEl) {
      windowEl.querySelector('.close-btn')?.dispatchEvent(new Event('click'))
    }
  }) as EventListener)
}

function loadDesktop() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  // Create main OS structure
  app.innerHTML = `
    <div class="vox-os">
      <div id="desktop" class="desktop"></div>
      <div id="taskbar" class="taskbar"></div>
      <div id="start-menu" class="start-menu hidden"></div>
      <div id="windows-container" class="windows-container"></div>
      <div id="notifications" class="notifications-container"></div>
      <div id="voice-assistant" class="voice-assistant"></div>
    </div>
  `

  // Initialize components
  createDesktop()
  createTaskbar()
  createStartMenu()
  
  // Initialize managers
  const windowManager = new WindowManager()
  const notificationManager = new NotificationManager()
  new VoiceAssistant(windowManager, notificationManager)

  // Setup WhatsApp launcher functions
  setupWhatsAppLauncher(notificationManager)
  
  // Setup browser functionality after a short delay
  setTimeout(() => {
    setupBrowserControls()
  }, 500)

  // Show welcome notification
  setTimeout(() => {
    notificationManager.show('Welcome to Vox . OS', '🚀 Your desktop experience is ready!', 'success')
    
    // Use Electron notification if available
    if (window.electronAPI) {
      window.electronAPI.showNotification('Vox . OS', 'Desktop Edition Loaded Successfully! 🎉')
    }
  }, 1000)

  // Log system info if in Electron
  if (window.electronAPI) {
    window.electronAPI.getSystemInfo().then((info: any) => {
      console.log('🖥️ System Info:', info)
    })
  }

  console.log('✅ Vox . OS Initialized')
}

function setupBrowserControls() {
  // Use event delegation since browser controls are created dynamically
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    
    if (target.id === 'browser-go') {
      const urlInput = document.getElementById('browser-url') as HTMLInputElement
      const iframe = document.getElementById('browser-frame') as HTMLIFrameElement
      
      if (urlInput && iframe) {
        let url = urlInput.value.trim()
        
        // If no protocol, check if it's a search query or URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url
          } else {
            // Treat as Google search
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url)
          }
        }
        
        iframe.src = url
        urlInput.value = url
      }
    }
    
    if (target.id === 'browser-back') {
      const iframe = document.getElementById('browser-frame') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.history.back()
      }
    }
    
    if (target.id === 'browser-forward') {
      const iframe = document.getElementById('browser-frame') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.history.forward()
      }
    }
    
    if (target.id === 'browser-refresh') {
      const iframe = document.getElementById('browser-frame') as HTMLIFrameElement
      if (iframe) {
        iframe.src = iframe.src
      }
    }
  })
  
  // Handle Enter key in URL bar
  document.addEventListener('keypress', (e) => {
    const target = e.target as HTMLElement
    if (target.id === 'browser-url' && e.key === 'Enter') {
      document.getElementById('browser-go')?.click()
    }
  })
}
