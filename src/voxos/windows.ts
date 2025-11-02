// Window Manager - Handles draggable app windows
export class WindowManager {
  private windows: Map<string, HTMLElement> = new Map()
  private zIndexCounter: number = 1000

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    window.addEventListener('open-app', ((e: CustomEvent) => {
      this.openWindow(e.detail, this.getAppTitle(e.detail))
    }) as EventListener)
  }

  openWindow(appId: string, title: string) {
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
    let currentX = 0
    let currentY = 0
    let initialX = 0
    let initialY = 0

    titlebar.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.window-btn')) return

      isDragging = true
      initialX = e.clientX - currentX
      initialY = e.clientY - currentY
      
      windowEl.style.zIndex = String(++this.zIndexCounter)
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return

      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY

      windowEl.style.left = `${currentX}px`
      windowEl.style.top = `${currentY}px`
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
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

    const contents: Record<string, string> = {
      files: '<div class="app-content"><h2>📁 File Explorer</h2><p>Your files and folders will appear here.</p></div>',
      music: '<div class="app-content"><h2>🎵 Music Player</h2><p>Play your favorite tunes.</p></div>',
      photos: '<div class="app-content"><h2>🖼️ Photos</h2><p>Browse your photo library.</p></div>',
      settings: '<div class="app-content"><h2>⚙️ Settings</h2><p>Configure your Vox OS.</p></div>',
      browser: `
        <div class="app-content browser-content">
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
            style="width: 100%; height: calc(100% - 50px); border: none; background: #fff;"
          ></iframe>
        </div>
      `,
      notes: '<div class="app-content"><h2>📝 Notes</h2><textarea style="width: 100%; height: 300px; padding: 10px;" placeholder="Write your notes..."></textarea></div>',
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
