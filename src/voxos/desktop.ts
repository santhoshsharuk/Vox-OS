// Desktop Background and Icons
export function createDesktop() {
  const desktop = document.getElementById('desktop')!
  
  desktop.innerHTML = `
    <div class="desktop-background"></div>
    <div class="desktop-icons">
      ${createDesktopIcon('📁', 'Files', 'files')}
      ${createDesktopIcon('🎵', 'Music', 'music')}
      ${createDesktopIcon('🖼️', 'Photos', 'photos')}
      ${createDesktopIcon('⚙️', 'Settings', 'settings')}
      ${createDesktopIcon('🌐', 'Browser', 'browser')}
      ${createDesktopIcon('', 'WhatsApp', 'whatsapp', true, '/assets/app/whatsapplogo.png')}
      ${createDesktopIcon('📝', 'Notes', 'notes')}
      ${createDesktopIcon('📖', 'Vox Learner', 'learning')}
      ${createDesktopIcon('🎮', 'Games', 'games')}
    </div>
  `

  // Add click handlers
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const appName = icon.getAttribute('data-app')
      window.dispatchEvent(new CustomEvent('open-app', { detail: appName }))
    })
  })

  // Add time display
  updateClock()
  setInterval(updateClock, 1000)
}

function createDesktopIcon(emoji: string, label: string, appId: string, useImage: boolean = false, imagePath: string = ''): string {
  const iconContent = useImage 
    ? `<img src="${imagePath}" alt="${label}" style="width: 48px; height: 48px; object-fit: contain;" />`
    : emoji
  
  return `
    <div class="desktop-icon" data-app="${appId}">
      <div class="icon-image">${iconContent}</div>
      <div class="icon-label">${label}</div>
    </div>
  `
}

function updateClock() {
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
  
  const clockEl = document.getElementById('clock')
  if (clockEl) {
    clockEl.innerHTML = `
      <div class="clock-time">${timeString}</div>
      <div class="clock-date">${dateString}</div>
    `
  }
}
