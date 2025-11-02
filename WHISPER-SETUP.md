# 🎙️ Whisper Setup Guide (Separate Service)

## Why Whisper Separately?
- **Offline** - Works without internet
- **Accurate** - OpenAI's best model
- **Free** - No API costs
- **Python-based** - Runs as separate service

## Installation

### 1. Install Python Dependencies
```bash
pip install openai-whisper
pip install flask flask-cors
pip install pyaudio
```

### 2. Start Whisper Service
```bash
python whisper-service.py
```

This starts a server on http://localhost:5000

## Connect from Vox OS

Update `src/voxos/voice.ts` to use Whisper:

```typescript
private async startWhisperListening() {
  try {
    const response = await fetch('http://localhost:5000/start', { 
      method: 'POST' 
    })
    const data = await response.json()
    console.log('Whisper:', data)
  } catch (error) {
    console.error('Whisper service not running')
  }
}

private async stopWhisperListening() {
  const response = await fetch('http://localhost:5000/stop', { 
    method: 'POST' 
  })
  const data = await response.json()
  if (data.transcript) {
    this.handleCommand(data.transcript)
  }
}
```

## Model Options
- `tiny` - Fastest (39M params)
- `base` - Balanced (74M params) ⭐ Recommended
- `small` - Better (244M params)
- `medium` - High quality (769M params)
- `large` - Best (1550M params)

## Usage
1. Run `python whisper-service.py` in one terminal
2. Run `npm run dev` in another terminal
3. Click mic button → speaks into mic → click stop → get transcription

## Advantages
✅ 100% Offline
✅ No API keys needed
✅ Very accurate
✅ Supports 99 languages
✅ Free forever

## Disadvantages
❌ Requires Python installed
❌ Two processes (Electron + Python)
❌ Not real-time (processes after recording stops)
❌ Larger memory footprint

## Alternative: Keep Current Setup
The Web Speech API you have now:
✅ Real-time transcription
✅ No separate process
✅ Built into Chrome/Electron
✅ Works well for commands

**Recommendation:** Keep current Web Speech API for now. Only switch to Whisper if you need offline support.
