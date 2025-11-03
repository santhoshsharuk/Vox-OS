// Vox OS Initialization
import './types'
import { SplashScreen } from './splash'
import { UserSetup } from './user-setup'
import { createDesktop } from './desktop'
import { createTaskbar } from './taskbar'
import { createStartMenu } from './startmenu'
import { VoiceAssistant } from './voice'
// Offline voice assistant (optional - keeping Web Speech API for now)
import { WindowManager } from './windows'
import { NotificationManager } from './notifications'

// Daily Motivational Quotes
function getRandomMotivationalQuote() {
  const quotes = [
    { text: "Believe you can and you're halfway there.", emoji: "💪" },
    { text: "The only way to do great work is to love what you do.", emoji: "❤️" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", emoji: "🚀" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", emoji: "✨" },
    { text: "It does not matter how slowly you go as long as you do not stop.", emoji: "🎯" },
    { text: "Everything you've ever wanted is on the other side of fear.", emoji: "🌟" },
    { text: "Believe in yourself. You are braver than you think, more talented than you know.", emoji: "🦁" },
    { text: "I learned that courage was not the absence of fear, but the triumph over it.", emoji: "🔥" },
    { text: "Opportunities don't happen, you create them.", emoji: "💡" },
    { text: "Don't watch the clock; do what it does. Keep going.", emoji: "⏰" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", emoji: "🏆" },
    { text: "Dream bigger. Do bigger.", emoji: "🌠" },
    { text: "Don't stop when you're tired. Stop when you're done.", emoji: "💯" },
    { text: "Wake up with determination. Go to bed with satisfaction.", emoji: "☀️" },
    { text: "Do something today that your future self will thank you for.", emoji: "🙏" },
    { text: "Little things make big days.", emoji: "🎈" },
    { text: "It's going to be hard, but hard does not mean impossible.", emoji: "⚡" },
    { text: "Great things never come from comfort zones.", emoji: "🎪" },
    { text: "Dream it. Wish it. Do it.", emoji: "🌈" },
    { text: "Success doesn't just find you. You have to go out and get it.", emoji: "🎯" },
    { text: "The key to success is to focus on goals, not obstacles.", emoji: "🔑" },
    { text: "Dream it. Believe it. Build it.", emoji: "🏗️" },
    { text: "Your limitation—it's only your imagination.", emoji: "🎨" },
    { text: "Push yourself, because no one else is going to do it for you.", emoji: "💪" },
    { text: "Sometimes later becomes never. Do it now.", emoji: "⚡" },
    { text: "Don't wait for opportunity. Create it.", emoji: "🚪" },
    { text: "You are capable of amazing things.", emoji: "🌟" },
    { text: "Every accomplishment starts with the decision to try.", emoji: "✨" },
    { text: "Be stronger than your excuses.", emoji: "🦾" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", emoji: "🌱" }
  ]
  
  // Get day of year to ensure same quote for the same day
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  
  // Use day of year as seed for consistent daily quote
  const index = dayOfYear % quotes.length
  return quotes[index]
}

export function initVoxOS() {
  // Show splash screen first
  new SplashScreen(() => {
    // After splash, check if it's first time user
    new UserSetup((userName: string) => {
      // Load desktop with user name
      loadDesktop(userName)
    })
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

function loadDesktop(userName: string) {
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
  const voiceAssistant = new VoiceAssistant(windowManager, notificationManager)

  // Store voice assistant globally for settings access
  ;(window as any).voiceAssistant = voiceAssistant

  // Listen for notification events from apps
  window.addEventListener('show-notification', ((e: CustomEvent) => {
    const { title, message, type } = e.detail
    notificationManager.show(title, message, type)
  }) as EventListener)

  // Setup WhatsApp launcher functions
  setupWhatsAppLauncher(notificationManager)
  
  // Setup browser functionality after a short delay
  setTimeout(() => {
    setupBrowserControls()
  }, 500)

  // Setup settings voice controls
  setTimeout(() => {
    setupSettingsControls(voiceAssistant)
  }, 500)

  // Show personalized welcome notification with voice and daily quote
  setTimeout(() => {
    const dailyQuote = getRandomMotivationalQuote()
    
    // Show welcome notification
    notificationManager.show(
      `Welcome to Vox OS, ${userName}!`, 
      `${dailyQuote.emoji} ${dailyQuote.text}`, 
      'success'
    )
    
    // Speak welcome message with quote
    voiceAssistant.speak(`Welcome ${userName} to Vox OS. ${dailyQuote.text}`)
    
    // Use Electron notification if available
    if (window.electronAPI) {
      window.electronAPI.showNotification('Vox OS', `Welcome ${userName}! ${dailyQuote.text}`)
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

function setupSettingsControls(voiceAssistant: VoiceAssistant) {
  // Use event delegation for settings navigation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    
    // Settings sidebar navigation
    if (target.classList.contains('settings-nav-item') || target.parentElement?.classList.contains('settings-nav-item')) {
      const navItem = target.classList.contains('settings-nav-item') ? target : target.parentElement as HTMLElement
      const section = navItem.getAttribute('data-section')
      
      if (section) {
        // Update active nav item
        document.querySelectorAll('.settings-nav-item').forEach(item => {
          ;(item as HTMLElement).style.borderLeft = '3px solid transparent'
          ;(item as HTMLElement).style.background = 'transparent'
          ;(item as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
        })
        navItem.style.borderLeft = '3px solid #3b82f6'
        navItem.style.background = 'rgba(59,130,246,0.1)'
        navItem.style.color = 'rgba(255,255,255,0.9)'
        
        // Show corresponding section
        document.querySelectorAll('.settings-section').forEach(sec => {
          ;(sec as HTMLElement).style.display = 'none'
        })
        const sectionEl = document.getElementById(`settings-${section}`)
        if (sectionEl) {
          sectionEl.style.display = 'block'
        }
      }
    }
    
    // Profile picture upload
    if (target.id === 'upload-profile-btn') {
      document.getElementById('profile-picture-input')?.click()
    }
    
    // Remove profile picture
    if (target.id === 'remove-profile-btn') {
      localStorage.removeItem('voxos-profile-picture')
      const avatarImg = document.getElementById('profile-avatar-img') as HTMLImageElement
      const avatarText = document.getElementById('profile-avatar-text')
      if (avatarImg && avatarText) {
        avatarImg.style.display = 'none'
        avatarText.style.display = 'block'
      }
      const removeBtn = document.getElementById('remove-profile-btn')
      if (removeBtn) removeBtn.style.display = 'none'
      updateTaskbarProfilePicture(null)
    }
    
    // Save profile changes
    if (target.id === 'save-profile-btn') {
      const usernameInput = document.getElementById('username-input') as HTMLInputElement
      if (usernameInput && usernameInput.value.trim()) {
        const newName = usernameInput.value.trim()
        localStorage.setItem('voxos-user-name', newName)
        
        // Update taskbar
        const userNameEl = document.querySelector('.user-name')
        if (userNameEl) {
          userNameEl.textContent = newName
        }
        
        // Show notification
        const event = new CustomEvent('show-notification', {
          detail: {
            title: 'Profile Updated',
            message: `✅ Your profile has been saved!`,
            type: 'success'
          }
        })
        window.dispatchEvent(event)
      }
    }
    
    // Voice gender buttons
    if (target.classList.contains('voice-gender-btn')) {
      const gender = target.getAttribute('data-gender') as 'male' | 'female'
      
      if (gender) {
        voiceAssistant.setVoiceGender(gender)
        
        // Update button states
        const buttons = document.querySelectorAll('.voice-gender-btn')
        buttons.forEach(btn => {
          if (btn.getAttribute('data-gender') === gender) {
            ;(btn as HTMLElement).style.background = gender === 'male' 
              ? 'rgba(59, 130, 246, 0.5)' 
              : 'rgba(139, 92, 246, 0.5)'
            ;(btn as HTMLElement).style.transform = 'scale(1.05)'
          } else {
            ;(btn as HTMLElement).style.background = gender === 'male'
              ? 'rgba(139, 92, 246, 0.2)'
              : 'rgba(59, 130, 246, 0.2)'
            ;(btn as HTMLElement).style.transform = 'scale(1)'
          }
        })
      }
    }
  })
  
  // Profile picture file input handler
  document.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement
    if (target.id === 'profile-picture-input' && target.files && target.files[0]) {
      const file = target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        localStorage.setItem('voxos-profile-picture', dataUrl)
        
        const avatarImg = document.getElementById('profile-avatar-img') as HTMLImageElement
        const avatarText = document.getElementById('profile-avatar-text')
        if (avatarImg && avatarText) {
          avatarImg.src = dataUrl
          avatarImg.style.display = 'block'
          avatarText.style.display = 'none'
        }
        
        const removeBtn = document.getElementById('remove-profile-btn')
        if (removeBtn) removeBtn.style.display = 'inline-block'
        
        // Update taskbar
        updateTaskbarProfilePicture(dataUrl)
      }
      
      reader.readAsDataURL(file)
    }
  })
  
  // Initialize settings when window opens
  window.addEventListener('open-app', ((e: CustomEvent) => {
    if (e.detail === 'settings') {
      setTimeout(() => {
        // Load current username
        const userName = localStorage.getItem('voxos-user-name') || 'User'
        const usernameInput = document.getElementById('username-input') as HTMLInputElement
        if (usernameInput) {
          usernameInput.value = userName
        }
        
        // Load profile picture
        const profilePicture = localStorage.getItem('voxos-profile-picture')
        if (profilePicture) {
          const avatarImg = document.getElementById('profile-avatar-img') as HTMLImageElement
          const avatarText = document.getElementById('profile-avatar-text')
          if (avatarImg && avatarText) {
            avatarImg.src = profilePicture
            avatarImg.style.display = 'block'
            avatarText.style.display = 'none'
          }
          const removeBtn = document.getElementById('remove-profile-btn')
          if (removeBtn) removeBtn.style.display = 'inline-block'
        }
        
        // Initialize voice gender button
        const currentGender = voiceAssistant.getVoiceGender()
        const buttons = document.querySelectorAll('.voice-gender-btn')
        buttons.forEach(btn => {
          if (btn.getAttribute('data-gender') === currentGender) {
            ;(btn as HTMLElement).style.background = currentGender === 'male' 
              ? 'rgba(59, 130, 246, 0.5)' 
              : 'rgba(139, 92, 246, 0.5)'
            ;(btn as HTMLElement).style.transform = 'scale(1.05)'
          }
        })
      }, 200)
    }
  }) as EventListener)
}

function updateTaskbarProfilePicture(dataUrl: string | null) {
  const userGreeting = document.querySelector('.user-greeting')
  if (!userGreeting) return
  
  const userIcon = userGreeting.querySelector('.user-icon')
  if (!userIcon) return
  
  if (dataUrl) {
    userIcon.innerHTML = `<img src="${dataUrl}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" />`
  } else {
    userIcon.textContent = '👤'
  }
}
