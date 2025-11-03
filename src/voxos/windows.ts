// Window Manager - Handles draggable app windows
import { NotesEditor } from './notes-editor'
import { createLearningPlatformWindow } from './learning-platform'

export class WindowManager {
  private windows: Map<string, HTMLElement> = new Map()
  private zIndexCounter: number = 1000
  private notesEditors: Map<string, NotesEditor> = new Map()

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    window.addEventListener('open-app', ((e: CustomEvent) => {
      this.openWindow(e.detail, this.getAppTitle(e.detail))
    }) as EventListener)
  }

  openWindow(appId: string, title: string) {
    // Special handling for Learning Platform
    if (appId === 'learning') {
      createLearningPlatformWindow()
      return
    }

    // Check if window already exists
    if (this.windows.has(appId)) {
      this.focusWindow(appId)
      return
    }

    const container = document.getElementById('windows-container')!
    const windowEl = document.createElement('div')
    windowEl.className = 'app-window'
    windowEl.id = `window-${appId}`
    windowEl.style.zIndex = String(++this.zIndexCounter)

    // Random position
    const x = 100 + Math.random() * 300
    const y = 80 + Math.random() * 200

    windowEl.style.left = `${x}px`
    windowEl.style.top = `${y}px`

    // Larger window for notes editor
    if (appId === 'notes') {
      windowEl.style.width = '900px'
      windowEl.style.height = '650px'
    }

    windowEl.innerHTML = `
      <div class="window-titlebar" data-window="${appId}">
        <div class="window-title">
          <span class="window-icon">${this.getAppIcon(appId)}</span>
          <span>${title}</span>
        </div>
        <div class="window-controls">
          <button class="window-btn minimize-btn" data-action="minimize">−</button>
          <button class="window-btn maximize-btn" data-action="maximize">□</button>
          <button class="window-btn close-btn" data-action="close">✕</button>
        </div>
      </div>
      <div class="window-content">
        ${this.getAppContent(appId)}
      </div>
    `

    container.appendChild(windowEl)
    this.windows.set(appId, windowEl)

    // Setup window interactions
    this.makeDraggable(windowEl, appId)
    this.setupWindowControls(windowEl, appId)

    // Add to taskbar
    this.addToTaskbar(appId, title)

    // Animate in
    setTimeout(() => windowEl.classList.add('active'), 10)
  }

  private makeDraggable(windowEl: HTMLElement, _appId: string) {
    const titlebar = windowEl.querySelector('.window-titlebar') as HTMLElement
    let isDragging = false
    let offsetX = 0
    let offsetY = 0
    let rafId: number | null = null

    titlebar.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.window-btn')) return

      isDragging = true
      const rect = windowEl.getBoundingClientRect()
      offsetX = e.clientX - rect.left
      offsetY = e.clientY - rect.top
      
      windowEl.style.zIndex = String(++this.zIndexCounter)
      windowEl.style.cursor = 'move'
      
      // Add will-change for better performance
      windowEl.style.willChange = 'transform'
      
      // Disable transitions during drag for immediate response
      windowEl.style.transition = 'none'
      
      e.preventDefault()
      e.stopPropagation()
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return

      e.preventDefault()
      
      // Cancel previous frame if still pending
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      
      // Use requestAnimationFrame for smooth animation
      rafId = requestAnimationFrame(() => {
        const newX = e.clientX - offsetX
        const newY = e.clientY - offsetY

        windowEl.style.left = `${newX}px`
        windowEl.style.top = `${newY}px`
        
        rafId = null
      })
    })

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false
        windowEl.style.cursor = ''
        windowEl.style.willChange = 'auto'
        
        // Re-enable transitions
        windowEl.style.transition = ''
        
        // Cancel any pending animation frame
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }
    })
  }

  private setupWindowControls(windowEl: HTMLElement, appId: string) {
    windowEl.querySelectorAll('.window-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action')
        
        switch (action) {
          case 'minimize':
            this.minimizeWindow(appId)
            break
          case 'maximize':
            this.toggleMaximize(windowEl)
            break
          case 'close':
            this.closeWindow(appId)
            break
        }
      })
    })

    // Focus window on click
    windowEl.addEventListener('mousedown', () => {
      windowEl.style.zIndex = String(++this.zIndexCounter)
    })
  }

  private focusWindow(appId: string) {
    const windowEl = this.windows.get(appId)
    if (windowEl) {
      windowEl.classList.remove('minimized')
      windowEl.style.zIndex = String(++this.zIndexCounter)
    }
  }

  private minimizeWindow(appId: string) {
    const windowEl = this.windows.get(appId)
    if (windowEl) {
      windowEl.classList.add('minimized')
    }
  }

  private toggleMaximize(windowEl: HTMLElement) {
    windowEl.classList.toggle('maximized')
  }

  private closeWindow(appId: string) {
    const windowEl = this.windows.get(appId)
    if (windowEl) {
      // Cleanup notes editor if exists
      if (appId === 'notes' && this.notesEditors.has(appId)) {
        this.notesEditors.get(appId)?.destroy()
        this.notesEditors.delete(appId)
      }

      windowEl.classList.remove('active')
      setTimeout(() => {
        windowEl.remove()
        this.windows.delete(appId)
        this.removeFromTaskbar(appId)
      }, 300)
    }
  }

  closeWindowByName(appId: string) {
    this.closeWindow(appId)
  }

  private addToTaskbar(appId: string, title: string) {
    const taskbarApps = document.getElementById('taskbar-apps')!
    const btn = document.createElement('button')
    btn.className = 'taskbar-app-btn active'
    btn.id = `taskbar-${appId}`
    btn.innerHTML = `
      <span>${this.getAppIcon(appId)}</span>
      <span class="taskbar-app-label">${title}</span>
    `
    btn.addEventListener('click', () => this.focusWindow(appId))
    taskbarApps.appendChild(btn)
  }

  private removeFromTaskbar(appId: string) {
    const btn = document.getElementById(`taskbar-${appId}`)
    btn?.remove()
  }

  private getAppIcon(appId: string): string {
    if (appId === 'whatsapp') {
      return '<img src="/assets/app/whatsapplogo.png" alt="WhatsApp" style="width: 20px; height: 20px; object-fit: contain;" />'
    }
    
    const icons: Record<string, string> = {
      files: '📁',
      music: '🎵',
      photos: '🖼️',
      settings: '⚙️',
      browser: '🌐',
      notes: '📝',
      learning: '📖',
      games: '🎮'
    }
    return icons[appId] || '📱'
  }

  private getAppTitle(appId: string): string {
    return appId.charAt(0).toUpperCase() + appId.slice(1)
  }

  private getAppContent(appId: string): string {
    // Special handling for WhatsApp
    if (appId === 'whatsapp') {
      return this.getWhatsAppContent()
    }

    // Special handling for Notes - initialize after window is created
    if (appId === 'notes') {
      setTimeout(() => {
        const containerId = `notes-container-${appId}`
        const notesEditor = new NotesEditor(containerId)
        this.notesEditors.set(appId, notesEditor)
      }, 100)
      return `<div id="notes-container-${appId}" style="width: 100%; height: 100%; display: flex; flex-direction: column;"></div>`
    }

    const contents: Record<string, string> = {
      files: '<div class="app-content"><h2>📁 File Explorer</h2><p>Your files and folders will appear here.</p></div>',
      music: '<div class="app-content"><h2>🎵 Music Player</h2><p>Play your favorite tunes.</p></div>',
      photos: '<div class="app-content"><h2>🖼️ Photos</h2><p>Browse your photo library.</p></div>',
      settings: `
        <div class="settings-container" style="display: flex; height: 100%; background: rgba(0,0,0,0.3);">
          <!-- Sidebar -->
          <div class="settings-sidebar" style="width: 220px; background: rgba(10,10,10,0.8); backdrop-filter: blur(20px); border-right: 1px solid rgba(255,255,255,0.08); padding: 20px 0; display: flex; flex-direction: column; gap: 5px;">
            <div class="settings-nav-item active" data-section="profile" style="padding: 12px 20px; cursor: pointer; color: rgba(255,255,255,0.9); font-weight: 500; transition: all 0.2s; border-left: 3px solid #3b82f6; background: rgba(59,130,246,0.1);">
              <span style="margin-right: 10px;">👤</span>User Profile
            </div>
            <div class="settings-nav-item" data-section="voice" style="padding: 12px 20px; cursor: pointer; color: rgba(255,255,255,0.6); font-weight: 500; transition: all 0.2s; border-left: 3px solid transparent;">
              <span style="margin-right: 10px;">🎤</span>Voice Assistant
            </div>
            <div class="settings-nav-item" data-section="appearance" style="padding: 12px 20px; cursor: pointer; color: rgba(255,255,255,0.6); font-weight: 500; transition: all 0.2s; border-left: 3px solid transparent;">
              <span style="margin-right: 10px;">🎨</span>Appearance
            </div>
            <div class="settings-nav-item" data-section="about" style="padding: 12px 20px; cursor: pointer; color: rgba(255,255,255,0.6); font-weight: 500; transition: all 0.2s; border-left: 3px solid transparent;">
              <span style="margin-right: 10px;">📊</span>About
            </div>
          </div>
          
          <!-- Content Area -->
          <div class="settings-content" style="flex: 1; overflow-y: auto; padding: 30px;">
            
            <!-- User Profile Section -->
            <div id="settings-profile" class="settings-section" style="display: block;">
              <h2 style="font-size: 28px; margin: 0 0 10px 0; color: rgba(255,255,255,0.95); font-weight: 700;">👤 User Profile</h2>
              <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">Customize your profile and appearance</p>
              
              <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px;">
                <!-- Profile Picture -->
                <div style="margin-bottom: 30px;">
                  <label style="display: block; margin-bottom: 15px; color: rgba(255,255,255,0.9); font-weight: 600;">Profile Picture</label>
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div id="profile-picture-preview" style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 40px; color: white; border: 3px solid rgba(255,255,255,0.2); overflow: hidden; position: relative;">
                      <span id="profile-avatar-text">👤</span>
                      <img id="profile-avatar-img" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
                    </div>
                    <div style="flex: 1;">
                      <input type="file" id="profile-picture-input" accept="image/*" style="display: none;" />
                      <button id="upload-profile-btn" style="padding: 10px 20px; background: rgba(59,130,246,0.8); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; cursor: pointer; font-weight: 600; margin-bottom: 8px; transition: all 0.3s;">
                        📷 Upload Photo
                      </button>
                      <button id="remove-profile-btn" style="padding: 10px 20px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); border-radius: 10px; color: rgba(239,68,68,0.9); cursor: pointer; font-weight: 600; transition: all 0.3s; display: none;">
                        🗑️ Remove Photo
                      </button>
                      <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 8px 0 0 0;">Recommended: Square image, 500x500px</p>
                    </div>
                  </div>
                </div>
                
                <!-- Username -->
                <div style="margin-bottom: 20px;">
                  <label style="display: block; margin-bottom: 10px; color: rgba(255,255,255,0.9); font-weight: 600;">Username</label>
                  <input type="text" id="username-input" value="" placeholder="Enter your name" style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px; color: rgba(255,255,255,0.95); font-size: 16px; font-family: inherit; transition: all 0.3s;" />
                  <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 8px 0 0 0;">This name appears in the taskbar and notifications</p>
                </div>
                
                <!-- Save Button -->
                <div style="margin-top: 25px;">
                  <button id="save-profile-btn" style="padding: 12px 30px; background: linear-gradient(135deg, rgba(59,130,246,0.8), rgba(139,92,246,0.8)); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Voice Assistant Section -->
            <div id="settings-voice" class="settings-section" style="display: none;">
              <h2 style="font-size: 28px; margin: 0 0 10px 0; color: rgba(255,255,255,0.95); font-weight: 700;">🎤 Voice Assistant</h2>
              <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">Configure voice recognition and speech settings</p>
              
              <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px;">
                <label style="display: block; margin-bottom: 15px; color: rgba(255,255,255,0.9); font-weight: 600;">Voice Gender</label>
                <div style="display: flex; gap: 15px;">
                  <button class="voice-gender-btn" data-gender="male" style="flex: 1; padding: 16px 24px; background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s;">
                    👨 Male Voice
                  </button>
                  <button class="voice-gender-btn" data-gender="female" style="flex: 1; padding: 16px 24px; background: rgba(139, 92, 246, 0.2); border: 2px solid #8b5cf6; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s;">
                    👩 Female Voice
                  </button>
                </div>
                <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 15px;">
                  Choose the voice gender for voice assistant responses and welcome messages.
                </p>
              </div>
            </div>
            
            <!-- Appearance Section -->
            <div id="settings-appearance" class="settings-section" style="display: none;">
              <h2 style="font-size: 28px; margin: 0 0 10px 0; color: rgba(255,255,255,0.95); font-weight: 700;">🎨 Appearance</h2>
              <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">Customize the look and feel of Vox OS</p>
              
              <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px;">
                <p style="color: rgba(255,255,255,0.7);">Theme customization and appearance settings coming soon!</p>
                <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 10px;">Current theme: Black Glass (Mac Style)</p>
              </div>
            </div>
            
            <!-- About Section -->
            <div id="settings-about" class="settings-section" style="display: none;">
              <h2 style="font-size: 28px; margin: 0 0 10px 0; color: rgba(255,255,255,0.95); font-weight: 700;">📊 About</h2>
              <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">System information and version details</p>
              
              <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px;">
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #3b82f6; font-size: 20px; margin-bottom: 10px;">Vox OS</h3>
                  <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 5px 0;">Desktop Edition v1.0</p>
                  <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 5px 0;">Premium Black Glass Theme</p>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8;">
                    ✨ Voice Assistant<br>
                    🎨 Mac-Style Glassmorphism<br>
                    📚 Learning Platform<br>
                    🌐 Built-in Browser<br>
                    💬 WhatsApp Integration
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      `,
      browser: `
        <div class="browser-content">
          <div class="browser-toolbar">
            <button class="browser-btn" id="browser-back">←</button>
            <button class="browser-btn" id="browser-forward">→</button>
            <button class="browser-btn" id="browser-refresh">⟳</button>
            <div class="browser-address-bar">
              <input 
                type="text" 
                id="browser-url" 
                placeholder="Search Google or enter URL..." 
                value="https://www.google.com"
              />
              <button class="browser-go" id="browser-go">Go</button>
            </div>
          </div>
          <iframe 
            id="browser-frame" 
            src="https://www.google.com/webhp?igu=1"
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        </div>
      `,
      games: '<div class="app-content"><h2>🎮 Games</h2><p>Fun and games coming soon!</p></div>'
    }
    return contents[appId] || '<div class="app-content"><p>App content</p></div>'
  }

  private getWhatsAppContent(): string {
    // Use Electron BrowserView for WhatsApp Web
    if (window.electronAPI) {
      setTimeout(() => {
        const windowEl = document.getElementById('window-whatsapp');
        if (windowEl) {
          this.setupWhatsAppView(windowEl);
        }
      }, 100);
      
      return '<div class="app-content whatsapp-electron-view" id="whatsapp-view-container" style="width: 100%; height: 100%; background: #fff;"></div>';
    } else {
      // Fallback for non-Electron
      return '<div class="app-content"><h2>WhatsApp Web</h2><p>WhatsApp Web is only available in the desktop app.</p></div>';
    }
  }

  private setupWhatsAppView(windowEl: HTMLElement) {
    if (!window.electronAPI) return;

    let isDragging = false;
    let animationFrameId: number | null = null;

    const updateBounds = () => {
      const container = windowEl.querySelector('#whatsapp-view-container') as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const bounds = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };

      window.electronAPI?.showWhatsApp(bounds);
    };

    // Smooth continuous updates during drag
    const continuousUpdate = () => {
      if (isDragging) {
        updateBounds();
        animationFrameId = requestAnimationFrame(continuousUpdate);
      }
    };

    // Initial positioning
    setTimeout(updateBounds, 100);

    // Update on window resize
    const observer = new ResizeObserver(() => {
      if (!isDragging) {
        updateBounds();
      }
    });
    observer.observe(windowEl);

    // Track dragging state
    const titlebar = windowEl.querySelector('.window-titlebar') as HTMLElement;
    if (titlebar) {
      titlebar.addEventListener('mousedown', (e) => {
        if (!(e.target as HTMLElement).closest('.window-btn')) {
          isDragging = true;
          continuousUpdate();
        }
      });
    }

    document.addEventListener('mousemove', () => {
      if (isDragging) {
        // Updates happen in continuousUpdate
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        setTimeout(updateBounds, 10);
      }
    });

    // Hide WhatsApp view when window is closed
    const closeBtn = windowEl.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        observer.disconnect();
        window.electronAPI?.hideWhatsApp();
      });
    }

    // Hide when minimized
    const minimizeBtn = windowEl.querySelector('.minimize-btn');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        window.electronAPI?.hideWhatsApp();
        setTimeout(() => {
          if (!windowEl.classList.contains('minimized')) {
            updateBounds();
          }
        }, 100);
      });
    }

    // Show when window is focused/restored
    windowEl.addEventListener('mousedown', () => {
      if (!windowEl.classList.contains('minimized')) {
        setTimeout(updateBounds, 10);
      }
    });
  }
}
