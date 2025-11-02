// Simple Video Splash Screen
export class SplashScreen {
  private splashContainer: HTMLElement | null = null
  private onCompleteCallback: (() => void) | null = null
  private video: HTMLVideoElement | null = null

  constructor(onComplete: () => void) {
    this.onCompleteCallback = onComplete
    this.createSplash()
  }

  private createSplash() {
    const container = document.createElement('div')
    container.id = 'splash-screen'
    container.className = 'splash-screen-container'
    
    container.innerHTML = `
      <video 
        id="splash-video" 
        class="splash-video-fullscreen" 
        autoplay 
        playsinline
      >
        <source src="/splash.mp4" type="video/mp4">
      </video>
    `
    
    document.body.appendChild(container)
    this.splashContainer = container
    this.video = document.getElementById('splash-video') as HTMLVideoElement
    
    this.setupVideoHandlers()
  }

  private setupVideoHandlers() {
    if (!this.video) return

    // Set volume to full
    this.video.volume = 1.0

    // Try to play with sound (browsers may block autoplay with sound)
    const playPromise = this.video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay with sound fails, mute and retry
        console.log('Autoplay with sound blocked, playing muted')
        this.video!.muted = true
        this.video!.play()
      })
    }

    // Close when video ends
    this.video.addEventListener('ended', () => {
      this.closeSplash()
    })

    // If video fails to load, close after 2 seconds
    this.video.addEventListener('error', () => {
      console.log('Video failed to load, skipping splash')
      setTimeout(() => {
        this.closeSplash()
      }, 2000)
    })

    this.video.addEventListener('loadedmetadata', () => {
      console.log('✅ Splash video loaded with audio')
    })
  }

  private closeSplash() {
    if (this.splashContainer) {
      this.splashContainer.classList.add('fade-out')
      
      setTimeout(() => {
        this.splashContainer?.remove()
        if (this.onCompleteCallback) {
          this.onCompleteCallback()
        }
      }, 500)
    }
  }
}
