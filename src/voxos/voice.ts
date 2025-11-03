// Voice Assistant with Whisper (Offline) + Web Speech API (Fallback)
export class VoiceAssistant {
  private recognition: any = null
  private synthesis: SpeechSynthesis
  private isListening: boolean = false
  private windowManager: any
  private notificationManager: any
  private useWhisper: boolean = false
  private whisperAvailable: boolean = false
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private voiceGender: 'male' | 'female' = 'male'

  constructor(windowManager: any, notificationManager: any) {
    this.windowManager = windowManager
    this.notificationManager = notificationManager
    this.synthesis = window.speechSynthesis

    // Load saved voice preference
    const savedGender = localStorage.getItem('voiceGender') as 'male' | 'female' | null
    if (savedGender) {
      this.voiceGender = savedGender
    }

    this.checkWhisperService()
    this.initializeRecognition()
    this.createUI()
    this.setupEventListeners()
  }

  private async checkWhisperService() {
    try {
      const response = await fetch('http://localhost:5000/status')
      const data = await response.json()
      if (data.status) {
        this.whisperAvailable = true
        this.useWhisper = true
        console.log('✅ Whisper service connected:', data.model)
        this.notificationManager.show('Whisper Ready', '🐍 Python service connected!', 'success')
      }
    } catch (error) {
      console.log('⚠️ Whisper service not available, using Web Speech API')
      this.whisperAvailable = false
      this.useWhisper = false
    }
  }

  private initializeRecognition() {
    // Use Web Speech API - works reliably in Electron
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.error('❌ Speech recognition not supported')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
    this.recognition.maxAlternatives = 1

    // Handle results
    this.recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      // Show interim text
      if (interimTranscript) {
        const interimEl = document.getElementById('interim-text')
        if (interimEl) {
          interimEl.textContent = `"${interimTranscript}..."`
          interimEl.style.color = 'rgba(255,255,255,0.9)'
        }
      }

      // Handle final text
      if (finalTranscript) {
        console.log('✅ Final:', finalTranscript)
        const interimEl = document.getElementById('interim-text')
        if (interimEl) {
          interimEl.textContent = `✅ "${finalTranscript}"`
          interimEl.style.color = '#10b981'
          setTimeout(() => {
            if (interimEl) interimEl.textContent = ''
          }, 2000)
        }
        this.handleCommand(finalTranscript)
      }
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error)
      if (event.error === 'not-allowed') {
        this.notificationManager.show('Microphone Access', '🎤 Please allow microphone', 'error')
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.log('Error:', event.error)
      }
    }

    this.recognition.onend = () => {
      if (this.isListening) {
        // Auto-restart for continuous listening
        try {
          this.recognition.start()
        } catch (e) {
          console.log('Restart:', e)
        }
      }
    }

    console.log('✅ Speech recognition ready')
  }

  private createUI() {
    const container = document.getElementById('voice-assistant')!
    container.innerHTML = `
      <div class="voice-panel hidden" id="voice-panel">
        <div class="voice-header">
          <h3>🎙️ Voice Assistant</h3>
          <button class="close-btn" id="close-voice">✕</button>
        </div>
        <div class="voice-content">
          <div class="voice-visualizer" id="voice-visualizer">
            <div class="pulse-ring"></div>
            <div class="voice-icon">🎤</div>
          </div>
          <div class="voice-status" id="voice-status">
            Click the microphone to start
          </div>
          <div class="interim-text" id="interim-text" style="min-height: 40px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; margin: 10px 0; font-size: 14px; color: rgba(255,255,255,0.7);"></div>
          <button class="voice-btn-large" id="voice-toggle">
            Start Listening
          </button>
        </div>
        <div class="voice-commands">
          <h4>🎤 Voice Commands:</h4>
          <ul>
            <li>"Open Files" / "Open Browser"</li>
            <li>"Open WhatsApp"</li>
            <li>"What time is it?"</li>
            <li>"What's the date?"</li>
            <li>"Show notifications"</li>
          </ul>
          <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 10px;">
            ✅ Google Web Speech API (100% Free)<br>
            🎯 Real-time continuous recognition<br>
            🌐 Requires internet connection
          </p>
        </div>
      </div>
    `
  }

  private setupEventListeners() {
    // Toggle voice panel
    window.addEventListener('toggle-voice', () => {
      const panel = document.getElementById('voice-panel')!
      panel.classList.toggle('hidden')
    })

    // Close button
    document.getElementById('close-voice')?.addEventListener('click', () => {
      document.getElementById('voice-panel')!.classList.add('hidden')
      this.stopListening()
    })

    // Voice toggle button
    document.getElementById('voice-toggle')?.addEventListener('click', () => {
      this.toggleListening()
    })

    // Handle text commands from search
    window.addEventListener('voice-command', ((e: CustomEvent) => {
      this.handleCommand(e.detail)
    }) as EventListener)
  }

  private toggleListening() {
    if (this.isListening) {
      this.stopListening()
    } else {
      this.startListening()
    }
  }

  private async startListening() {
    if (this.useWhisper && this.whisperAvailable) {
      // Use Whisper Python service
      await this.startWhisperListening()
    } else {
      // Use Web Speech API
      this.startWebSpeechListening()
    }
  }

  private async stopListening() {
    if (this.useWhisper && this.whisperAvailable) {
      await this.stopWhisperListening()
    } else {
      this.stopWebSpeechListening()
    }
  }

  // Web Speech API methods
  private startWebSpeechListening() {
    if (!this.recognition) return

    try {
      this.recognition.start()
      this.isListening = true
      this.updateUI()
      this.notificationManager.show('Voice Assistant', '🎙️ Listening (Web Speech)...', 'success')
      console.log('🎤 Started Web Speech listening')
    } catch (error: any) {
      if (error.message && error.message.includes('already started')) {
        this.isListening = true
        this.updateUI()
      } else {
        console.error('Start error:', error)
      }
    }
  }

  private stopWebSpeechListening() {
    if (!this.recognition) return

    try {
      this.recognition.stop()
      this.isListening = false
      this.updateUI()
      console.log('🛑 Stopped Web Speech listening')
    } catch (error: any) {
      console.error('Stop error:', error)
    }
  }

  // Whisper Python service methods
  private async startWhisperListening() {
    try {
      // Start recording audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start()
      this.isListening = true
      this.updateUI()
      
      // Notify Whisper service
      await fetch('http://localhost:5000/start', { method: 'POST' })
      
      this.notificationManager.show('Voice Assistant', '🐍 Listening (Whisper)...', 'success')
      console.log('🎤 Started Whisper listening')
    } catch (error: any) {
      console.error('Whisper start error:', error)
      this.notificationManager.show('Microphone Error', error.message, 'error')
    }
  }

  private async stopWhisperListening() {
    if (!this.mediaRecorder) return

    try {
      this.mediaRecorder.stop()
      this.isListening = false
      this.updateUI()

      // Wait for audio data
      await new Promise(resolve => {
        if (this.mediaRecorder) {
          this.mediaRecorder.onstop = resolve
        }
      })

      // Create audio blob and send to Whisper
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      console.log('🔄 Sending to Whisper...')
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      console.log('✅ Whisper result:', data.transcript)

      if (data.transcript) {
        const interimEl = document.getElementById('interim-text')
        if (interimEl) {
          interimEl.textContent = `✅ "${data.transcript}"`
          interimEl.style.color = '#10b981'
          setTimeout(() => {
            if (interimEl) interimEl.textContent = ''
          }, 2000)
        }
        this.handleCommand(data.transcript)
      }

      // Stop media tracks
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }
    } catch (error: any) {
      console.error('Whisper stop error:', error)
      this.notificationManager.show('Whisper Error', error.message, 'error')
    }
  }

  private updateUI() {
    const status = document.getElementById('voice-status')!
    const btn = document.getElementById('voice-toggle')!
    const visualizer = document.getElementById('voice-visualizer')!
    const interimEl = document.getElementById('interim-text')

    if (this.isListening) {
      status.textContent = '🎤 Listening... Speak now!'
      btn.textContent = 'Stop Listening'
      visualizer.classList.add('active')
      if (interimEl) {
        interimEl.textContent = 'Waiting for speech...'
        interimEl.style.color = 'rgba(255,255,255,0.5)'
      }
    } else {
      status.textContent = 'Click the microphone to start'
      btn.textContent = 'Start Listening'
      visualizer.classList.remove('active')
      if (interimEl) {
        interimEl.textContent = ''
      }
    }
  }

  private handleCommand(command: string) {
    console.log('🎯 Voice command received:', command)
    const lowerCommand = command.toLowerCase()

    // Always show notification for feedback
    this.notificationManager.show('Voice Command', `🎤 "${command}"`, 'info')

    // Open app commands
    if (lowerCommand.includes('open')) {
      const apps = ['files', 'music', 'photos', 'settings', 'browser', 'chat', 'notes', 'games', 'whatsapp']
      const app = apps.find(a => lowerCommand.includes(a))
      if (app) {
        console.log('✅ Opening app:', app)
        this.windowManager.openWindow(app, app.charAt(0).toUpperCase() + app.slice(1))
        this.speak(`Opening ${app}`)
        return
      }
    }

    // Time command
    if (lowerCommand.includes('time')) {
      const time = new Date().toLocaleTimeString()
      console.log('⏰ Time command:', time)
      this.speak(`The time is ${time}`)
      this.notificationManager.show('Time', time, 'info')
      return
    }

    // Date command
    if (lowerCommand.includes('date') || lowerCommand.includes('today')) {
      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      console.log('📅 Date command:', date)
      this.speak(`Today is ${date}`)
      this.notificationManager.show('Date', date, 'info')
      return
    }

    // Default response
    console.log('❓ Unknown command:', command)
    this.speak('I heard you. Command received.')
  }

  speak(text: string) {
    console.log('🔊 Speaking:', text)
    
    if (!this.synthesis) {
      console.error('❌ Speech synthesis not available')
      return
    }
    
    // Cancel any ongoing speech
    this.synthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    // Select voice based on gender preference
    const voices = this.synthesis.getVoices()
    const selectedVoice = this.selectVoiceByGender(voices, this.voiceGender)
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log('🎤 Using voice:', selectedVoice.name)
    }
    
    utterance.onstart = () => console.log('✅ Speech started')
    utterance.onend = () => console.log('✅ Speech ended')
    utterance.onerror = (e) => console.error('❌ Speech error:', e)
    
    this.synthesis.speak(utterance)
  }

  private selectVoiceByGender(voices: SpeechSynthesisVoice[], gender: 'male' | 'female'): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null

    // Filter voices by gender
    const genderVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase()
      const isFemale = name.includes('female') || name.includes('woman') || 
                       name.includes('zira') || name.includes('samantha') || 
                       name.includes('victoria') || name.includes('susan')
      const isMale = name.includes('male') || name.includes('man') || 
                     name.includes('david') || name.includes('mark') || 
                     name.includes('george') || name.includes('james')
      
      if (gender === 'female') {
        return isFemale || (!isMale && voice.name.match(/^(Microsoft|Google|Apple).*Female/i))
      } else {
        return isMale || (!isFemale && voice.name.match(/^(Microsoft|Google|Apple).*Male/i))
      }
    })

    // Prefer English voices
    const englishVoices = genderVoices.filter(v => v.lang.startsWith('en'))
    if (englishVoices.length > 0) {
      return englishVoices[0]
    }

    // Fallback to any gender-matching voice
    if (genderVoices.length > 0) {
      return genderVoices[0]
    }

    // Last resort: return first available voice
    return voices[0]
  }

  setVoiceGender(gender: 'male' | 'female') {
    this.voiceGender = gender
    localStorage.setItem('voiceGender', gender)
    console.log('🎤 Voice gender set to:', gender)
    this.notificationManager.show('Voice Settings', `Voice changed to ${gender}`, 'success')
  }

  getVoiceGender(): 'male' | 'female' {
    return this.voiceGender
  }
}
