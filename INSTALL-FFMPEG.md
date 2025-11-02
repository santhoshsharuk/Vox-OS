# 🎬 FFmpeg Installation for Whisper

Whisper needs FFmpeg to decode audio files (webm → wav).

## Quick Install (Windows)

### Option 1: Chocolatey (Easiest)
```powershell
# Run PowerShell as Administrator
choco install ffmpeg -y
```

### Option 2: Manual Download
1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to `C:\ffmpeg`
3. Add to PATH:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find `Path`
   - Click "Edit" → "New"
   - Add: `C:\ffmpeg\bin`
   - Click OK on all windows
4. Restart terminals

### Option 3: Winget
```powershell
winget install ffmpeg
```

## Verify Installation
```powershell
ffmpeg -version
```

## Alternative: Use Web Speech API
If FFmpeg installation is problematic, your app already works with Google's Web Speech API (no FFmpeg needed). The Whisper integration is optional for offline use.

To disable Whisper and use Web Speech API only:
- Just don't run `python whisper-service.py`
- The app will auto-fallback to Web Speech API
