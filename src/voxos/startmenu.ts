// Start Menu Component
export function createStartMenu() {
  const startMenu = document.getElementById('start-menu')!
  
  startMenu.innerHTML = `
    <div class="start-menu-header">
      <div class="user-profile">
        <div class="user-avatar">👤</div>
        <div class="user-name">Vox . OS User</div>
      </div>
    </div>
    <div class="start-menu-apps">
      <div class="app-category">
        <h3>📱 Applications</h3>
        <div class="app-grid">
          ${createAppTile('📁', 'Files', 'files')}
          ${createAppTile('🎵', 'Music', 'music')}
          ${createAppTile('🖼️', 'Photos', 'photos')}
          ${createAppTile('🌐', 'Browser', 'browser')}
          ${createAppTile('', 'WhatsApp', 'whatsapp', true, '/assets/app/whatsapplogo.png')}
          ${createAppTile('📝', 'Notes', 'notes')}
          ${createAppTile('📖', 'Vox Learner', 'learning')}
          ${createAppTile('🎮', 'Games', 'games')}
          ${createAppTile('⚙️', 'Settings', 'settings')}
        </div>
      </div>
    </div>
    <div class="start-menu-footer">
      <button class="power-btn" title="Power Options">⚡</button>
      <button class="settings-btn" title="Settings">⚙️</button>
    </div>
  `

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.start-menu') && !target.closest('.start-button')) {
      startMenu.classList.add('hidden')
    }
  })

  // App tile handlers
  startMenu.querySelectorAll('.app-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const appId = tile.getAttribute('data-app-id') || ''
      if (appId) {
        window.dispatchEvent(new CustomEvent('open-app', { detail: appId }))
        startMenu.classList.add('hidden')
      }
    })
  })
}

function createAppTile(emoji: string, label: string, appId: string, useImage: boolean = false, imagePath: string = ''): string {
  const iconContent = useImage 
    ? `<img src="${imagePath}" alt="${label}" style="width: 32px; height: 32px; object-fit: contain;" />`
    : emoji
  
  return `
    <div class="app-tile" data-app-id="${appId}">
      <div class="app-tile-icon">${iconContent}</div>
      <div class="app-tile-label">${label}</div>
    </div>
  `
}
