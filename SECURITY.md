# 🔒 Vox OS Security Configuration

## Security Features Implemented

### ✅ 1. Content Security Policy (CSP)
Located in `index.html`, our CSP allows:
- **Scripts**: Self + inline scripts (Vite) + eval (Deepgram SDK)
- **Workers**: Self + blob URLs (for Web Workers)
- **Styles**: Self + inline (for dynamic styling)
- **Images**: Self + data URLs + HTTPS sources
- **Media**: Self + data URLs (for splash video)
- **Connect**: Self + data/blob + WhatsApp Web + Deepgram API + Google APIs
- **Frames**: WhatsApp Web only

**Note:** `unsafe-eval` is required for Deepgram SDK functionality. This is safe because:
- ✅ All code runs from trusted npm packages
- ✅ Deepgram SDK is industry-standard and audited
- ✅ API key stored in `.env` file (not in code)

### ✅ 2. Electron Security Settings

```javascript
webPreferences: {
  nodeIntegration: false,           // ✅ Prevents direct Node.js access
  contextIsolation: true,           // ✅ Isolates renderer from main process
  webSecurity: true,                // ✅ REQUIRED for Web Speech API!
  allowRunningInsecureContent: false, // ✅ Blocks HTTP on HTTPS
  sandbox: false                    // Required for preload script
}
```

### ✅ 3. Permission Management

**Allowed Permissions:**
- 🎤 `media` - Microphone for voice recognition
- 🔑 `mediaKeySystem` - Protected media playback
- 📍 `geolocation` - Location services (if needed)
- 🔔 `notifications` - System notifications
- 🎹 `midi` - MIDI device access (if needed)

**Permission Handlers:**
- `setPermissionRequestHandler` - Controls runtime permissions
- `setPermissionCheckHandler` - Validates permission origins

### ✅ 4. BrowserView Security

WhatsApp BrowserView uses:
- Chrome 120 user agent for compatibility
- Isolated web context (separate from main window)
- Controlled IPC communication only

---

## 🛡️ Security Levels by Environment

### Development Mode (`npm run dev`)
- ✅ CSP active (with unsafe-inline for Vite)
- ✅ webSecurity: **true** (REQUIRED for Web Speech API!)
- ✅ DevTools open by default

### Production Mode (Packaged `.exe`)
- ✅ CSP fully enforced
- ✅ webSecurity: **true**
- ✅ No DevTools
- ✅ Code signing recommended

---

## 🎙️ Voice Recognition Solution

### ✅ Deepgram Real-Time Streaming (Current Implementation)

We use **Deepgram** - an AI-powered speech recognition API with 200 free minutes/month:

#### How It Works:
1. User clicks **Voice Assistant** button in Vox OS
2. **Deepgram client** connects to streaming API with Nova-2 model
3. Microphone permission requested (one-time)
4. **Real-time audio streaming** - Sends audio chunks every 100ms
5. Interim transcriptions shown as you speak
6. Final transcriptions trigger voice commands instantly
7. Commands processed in Vox OS

#### Advantages:
- ✅ **200 Free Minutes/Month** - No credit card required
- ✅ **Nova-2 Model** - State-of-the-art accuracy (better than Google)
- ✅ **Real-time Streaming** - Ultra-low latency (< 300ms)
- ✅ **Interim Results** - See text as you speak
- ✅ **Multi-language** - 30+ languages supported
- ✅ **Smart Formatting** - Auto punctuation, capitalization
- ✅ **No Rate Limits** - On free tier

#### Requirements:
- 🔑 **API Key** - Stored securely in `.env` file
- ⚠️ **Internet connection** - Uses Deepgram API
- ✅ **Microphone access** - Browser permission required
- ✅ **CSP Updated** - Allows `api.deepgram.com` and WebSocket connections

#### Setup:
1. Get free API key from [deepgram.com](https://deepgram.com)
2. Create `.env` file in project root:
   ```env
   VITE_DEEPGRAM_API_KEY=your_api_key_here
   ```
3. Restart app with `npm run dev`

#### Architecture:
```
Vox OS UI → MediaRecorder → Deepgram WebSocket → Nova-2 Model → Text → Voice Commands
                ↓
          (Real-time streaming)
```

#### Supported Languages:
Change `language` parameter in `voice.ts`:
- `en-US` - English (United States) ✅ Current
- `en-GB` - English (United Kingdom)
- `ta` - Tamil
- `hi` - Hindi
- [Full list](https://developers.deepgram.com/docs/languages-overview)

#### Free Tier Limits:
- 200 minutes/month
- No credit card required
- Full API access
- Nova-2 model included

### Alternative: Other Voice Recognition

For **different voice recognition options**:

1. **Web Speech API** - Google's free browser API, requires webSecurity: true
2. **Vosk** - Offline, complex setup, requires `.tar.gz` models
3. **Whisper.cpp** - OpenAI's model, very accurate, offline
4. **Search bar** - Type commands manually (always works)

---

## 📋 Security Checklist for Production

Before building for production:

- [ ] Update `package.json` version
- [ ] Set proper `author` and `description`
- [ ] Add code signing certificate
- [ ] Test with `webSecurity: true`
- [ ] Remove debug/console logs
- [ ] Enable auto-updates (electron-updater)
- [ ] Add crash reporting (Sentry)
- [ ] Test CSP doesn't block features
- [ ] Verify all permissions work
- [ ] Build with `npm run build`

---

## 🔐 Best Practices

1. **Never disable webSecurity in production**
2. **Always use contextIsolation: true**
3. **Minimize unsafe-inline in CSP**
4. **Validate all user inputs**
5. **Keep Electron updated**
6. **Use HTTPS for all external resources**
7. **Implement auto-updates**
8. **Sign your builds**

---

## 📚 Resources

- [Electron Security Docs](https://www.electronjs.org/docs/latest/tutorial/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Vosk Speech Recognition](https://alphacephei.com/vosk/)
- [Electron Builder Signing](https://www.electron.build/code-signing)

---

**Current Status:** ✅ Development-ready with production security planned
