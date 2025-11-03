// First-time User Setup
export class UserSetup {
  private setupContainer: HTMLElement | null = null
  private onCompleteCallback: ((userName: string) => void) | null = null

  constructor(onComplete: (userName: string) => void) {
    this.onCompleteCallback = onComplete
    this.checkFirstTime()
  }

  private checkFirstTime() {
    const userName = localStorage.getItem('voxos-user-name')
    
    if (userName) {
      // User already exists, skip setup
      if (this.onCompleteCallback) {
        this.onCompleteCallback(userName)
      }
    } else {
      // First time user, show setup
      this.createSetupScreen()
    }
  }

  private createSetupScreen() {
    const container = document.createElement('div')
    container.id = 'user-setup-screen'
    container.className = 'user-setup-container'
    
    container.innerHTML = `
      <div class="user-setup-content">
        <div class="setup-header">
          <h1 class="setup-title">Welcome to Vox OS</h1>
          <p class="setup-subtitle">Let's personalize your experience</p>
        </div>
        
        <div class="setup-form">
          <div class="setup-input-group">
            <input 
              type="text" 
              id="user-name-input" 
              class="setup-input" 
              placeholder="Enter your name"
              maxlength="30"
              autocomplete="off"
            />
          </div>
          
          <button id="setup-continue-btn" class="setup-btn" disabled>
            <span>Continue</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(container)
    this.setupContainer = container
    
    this.setupEventListeners()
    
    // Focus on input after a short delay
    setTimeout(() => {
      const input = document.getElementById('user-name-input') as HTMLInputElement
      input?.focus()
    }, 300)
  }

  private setupEventListeners() {
    const input = document.getElementById('user-name-input') as HTMLInputElement
    const continueBtn = document.getElementById('setup-continue-btn') as HTMLButtonElement
    
    if (!input || !continueBtn) return

    // Enable/disable button based on input
    input.addEventListener('input', () => {
      const value = input.value.trim()
      continueBtn.disabled = value.length === 0
      
      if (value.length > 0) {
        continueBtn.classList.add('enabled')
      } else {
        continueBtn.classList.remove('enabled')
      }
    })

    // Handle Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim().length > 0) {
        this.saveAndContinue(input.value.trim())
      }
    })

    // Handle continue button click
    continueBtn.addEventListener('click', () => {
      if (input.value.trim().length > 0) {
        this.saveAndContinue(input.value.trim())
      }
    })
  }

  private saveAndContinue(userName: string) {
    // Save user name to localStorage
    localStorage.setItem('voxos-user-name', userName)
    
    // Show success animation
    if (this.setupContainer) {
      const content = this.setupContainer.querySelector('.user-setup-content')
      if (content) {
        content.innerHTML = `
          <div class="setup-success">
            <h2>Welcome, ${userName}!</h2>
            <p>Setting up your workspace...</p>
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        `
      }
      
      // Close setup screen after showing welcome
      setTimeout(() => {
        this.closeSetup(userName)
      }, 2000)
    }
  }

  private closeSetup(userName: string) {
    if (this.setupContainer) {
      this.setupContainer.classList.add('fade-out')
      
      setTimeout(() => {
        this.setupContainer?.remove()
        if (this.onCompleteCallback) {
          this.onCompleteCallback(userName)
        }
      }, 500)
    }
  }

  static getUserName(): string {
    return localStorage.getItem('voxos-user-name') || 'User'
  }

  static updateUserName(newName: string): void {
    localStorage.setItem('voxos-user-name', newName)
  }
}
