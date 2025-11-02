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
          ${createAppTile('📁', 'Files')}
          ${createAppTile('🎵', 'Music')}
          ${createAppTile('🖼️', 'Photos')}
          ${createAppTile('🌐', 'Browser')}
          ${createAppTile('', 'WhatsApp', true, '/assets/app/whatsapplogo.png')}
          ${createAppTile('📝', 'Notes')}
          ${createAppTile('🎮', 'Games')}
          ${createAppTile('⚙️', 'Settings')}
          ${createAppTile('📊', 'Analytics')}
          ${createAppTile('🎨', 'Design')}
          ${createAppTile('🔧', 'Tools')}
          ${createAppTile('📚', 'Library')}
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
      const appName = tile.querySelector('.app-tile-label')?.textContent || ''
      window.dispatchEvent(new CustomEvent('open-app', { detail: appName.toLowerCase() }))
      startMenu.classList.add('hidden')
    })
  })
}

function createAppTile(emoji: string, label: string, useImage: boolean = false, imagePath: string = ''): string {
  const iconContent = useImage 
    ? `<img src="${imagePath}" alt="${label}" style="width: 32px; height: 32px; object-fit: contain;" />`
    : emoji
  
  return `
    <div class="app-tile">
      <div class="app-tile-icon">${iconContent}</div>
      <div class="app-tile-label">${label}</div>
    </div>
  `
}
