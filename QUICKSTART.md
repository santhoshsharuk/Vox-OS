# 🚀 Quick Start Guide - Vox OS Desktop Edition

## ⚡ Run in 3 Steps

### 1️⃣ Install Dependencies (First Time Only)

```bash
npm install
```

### 2️⃣ Start Development Mode

```bash
npm run dev
```

This will:
- ✅ Launch Vite dev server
- ✅ Open Electron desktop app
- ✅ Enable hot-reload

### 3️⃣ Start Using!

The Vox OS desktop app will open automatically.

---

## 🎯 What Can You Do?

### Open Apps
- 🖱️ **Double-click** desktop icons
- 📱 Click **"Vox"** button → pick an app
- 🎙️ Click **microphone** → say "Open Files"
- 🔍 Type in **search bar** → press Enter

### Use Voice
1. Click 🎙️ microphone button
2. Say: "Open Files", "What time is it?", etc.
3. AI will respond!

### Manage Windows
- 🖱️ **Drag** titlebar to move
- ➖ **Minimize** to taskbar
- ⬜ **Maximize** to fullscreen
- ✕ **Close** window

---

## 📦 Build Installer

```bash
# Build for Windows, macOS, or Linux
npm run dist
```

Find your installer in `release/` folder:
- **Windows**: `Vox OS Setup.exe`
- **macOS**: `Vox OS.dmg`
- **Linux**: `Vox-OS.AppImage`

---

## ⚙️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode |
| `npm run build` | Build production files |
| `npm start` | Run built app |
| `npm run dist` | Create installer |
| `npm run pack` | Create portable version |

---

## 🎨 Customize

### Change Colors
Edit `src/style.css` - look for gradient colors

### Add Apps
Edit `src/voxos/windows.ts` - add to `getAppContent()`

### Add Voice Commands
Edit `src/voxos/voice.ts` - add to `handleCommand()`

---

## ❓ Troubleshooting

### App won't start?
```bash
rm -rf node_modules
npm install
npm run dev
```

### Voice not working?
- Allow microphone permission
- Works best in Chrome/Electron
- Check console for errors

### Build error?
```bash
npm install electron-builder --save-dev
npm run build
```

---

## 🚀 Next Steps

1. ✅ Run the app
2. 🎨 Customize the look
3. 📱 Add your own apps
4. 🎙️ Create voice commands
5. 📦 Build and share!

---

**Need help?** Check `README.md` for full documentation.

**Enjoy your new desktop OS! 🪄**
