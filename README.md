# 🪄 Vox OS - Desktop Edition

> A full-featured **Web-Based Desktop Operating System** experience powered by **Electron.js**

<div align="center">

![Vox OS](https://img.shields.io/badge/Vox%20OS-Desktop%20Edition-blue?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-39.0.0-47848F?style=for-the-badge&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)

</div>

---

## ✨ Features

### 🖥️ Desktop Experience
- **Full Desktop UI** - Complete OS-like interface with desktop, icons, and taskbar
- **Multi-Window System** - Draggable, resizable app windows with minimize/maximize/close
- **Start Menu** - Beautiful app launcher with categorized applications
- **Taskbar** - Active app management with quick access buttons
- **System Tray** - Clock, notifications, and system controls

### 🎙️ Voice Assistant
- **Web Speech API Integration** - Voice commands and text-to-speech
- **Natural Commands** - "Open Files", "What time is it?", etc.
- **Visual Feedback** - Animated pulse ring during listening
- **Smart Processing** - Context-aware command handling

### 🪟 Window Management
- **Drag & Drop** - Smooth window dragging
- **Z-Index Management** - Smart window focus and layering
- **Minimize/Maximize** - Full window control
- **Multiple Apps** - Run several apps simultaneously

### 🔔 Notifications
- **Native Desktop Notifications** - Using Electron's Notification API
- **In-App Notifications** - Beautiful toast-style notifications
- **Auto-dismiss** - Configurable timeout
- **Multiple Types** - Info, success, warning, error

### 📱 Built-in Apps
- 📁 **Files** - File explorer (coming soon)
- 🎵 **Music** - Media player
- 🖼️ **Photos** - Image gallery
- 🌐 **Browser** - Web browser
- 💬 **Chat** - Messaging app
- 📝 **Notes** - Note-taking app
- 🎮 **Games** - Game launcher
- ⚙️ **Settings** - System configuration

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn**
- Windows / macOS / Linux

### Installation

```bash
# Clone the repository (if from git)
git clone <your-repo>
cd vox-os

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### 🎯 Development Mode

```bash
npm run dev
```

This will:
1. Start Vite dev server at `http://localhost:5173`
2. Launch Electron app automatically
3. Enable hot-reload for instant updates
4. Open DevTools for debugging

### 📦 Build for Production

```bash
# Build the web assets
npm run build

# Run the built app
npm start
```

### 🔨 Create Installable Package

```bash
# Create installer for current platform
npm run dist

# Create portable version
npm run pack
```

**Output:**
- Windows: `.exe` installer + portable `.exe`
- macOS: `.dmg` disk image
- Linux: `.AppImage` + `.deb` package

Files will be in the `release/` folder.

---

## 📁 Project Structure

```
vox-os/
├── src/
│   ├── voxos/
│   │   ├── init.ts          # Main initialization
│   │   ├── desktop.ts       # Desktop & icons
│   │   ├── taskbar.ts       # Taskbar component
│   │   ├── startmenu.ts     # Start menu
│   │   ├── windows.ts       # Window manager
│   │   ├── voice.ts         # Voice assistant
│   │   ├── notifications.ts # Notification system
│   │   └── types.ts         # TypeScript types
│   ├── main.ts              # Entry point
│   └── style.css            # Global styles
├── main.js                  # Electron main process
├── preload.js               # Electron preload (security bridge)
├── package.json             # Dependencies & scripts
└── tsconfig.json            # TypeScript config
```

---

## 🎮 Usage Guide

### Opening Apps

**Method 1: Desktop Icons**
- Double-click any desktop icon

**Method 2: Start Menu**
- Click "Vox" button in taskbar
- Click an app tile

**Method 3: Voice Commands**
- Click 🎙️ microphone button
- Say: "Open [app name]"

**Method 4: Search**
- Type in search bar
- Press Enter

### Voice Commands

| Command | Action |
|---------|--------|
| "Open Files" | Launch File Explorer |
| "Open Settings" | Open Settings app |
| "What time is it?" | Speak current time |
| "Show notifications" | Display notification |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Win` / `Cmd` | Open Start Menu |
| `Alt + F4` | Close Window |
| `Win + D` | Show Desktop |

---

## 🛠️ Electron API Features

### Available APIs (via `window.electronAPI`)

```typescript
// Show desktop notification
window.electronAPI?.showNotification('Title', 'Message')

// Get system info
const info = await window.electronAPI?.getSystemInfo()
console.log(info.platform, info.arch)

// Window controls
window.electronAPI?.minimizeWindow()
window.electronAPI?.maximizeWindow()
window.electronAPI?.closeWindow()
```

---

## 🎨 Customization

### Changing Theme Colors

Edit `src/style.css`:

```css
.desktop {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

.start-button {
  background: linear-gradient(135deg, #your-accent-1, #your-accent-2);
}
```

### Adding New Apps

1. Add icon to desktop (`src/voxos/desktop.ts`)
2. Add tile to start menu (`src/voxos/startmenu.ts`)
3. Add content in window manager (`src/voxos/windows.ts`)

Example:

```typescript
// In windows.ts getAppContent()
calculator: '<div class="app-content"><h2>🧮 Calculator</h2>...</div>'
```

### Custom Voice Commands

Edit `src/voxos/voice.ts` in `handleCommand()`:

```typescript
if (lowerCommand.includes('hello')) {
  this.speak('Hello! How can I help you?')
  return
}
```

---

## 🔧 Advanced Configuration

### Electron Builder Options

Edit `package.json` → `build` section:

```json
{
  "build": {
    "appId": "com.yourcompany.voxos",
    "productName": "Vox OS",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "path/to/icon.ico"
    }
  }
}
```

### Window Settings

Edit `main.js`:

```javascript
const win = new BrowserWindow({
  width: 1920,
  height: 1080,
  fullscreen: true,  // Start fullscreen
  frame: false,      // Frameless window
  // ... other options
})
```

---

## 🚀 Future Enhancements

### Planned Features

- [ ] 🔊 **AI Voice Assistant** (GPT/Claude integration)
- [ ] 🗂️ **Real File System Access** (Electron fs module)
- [ ] 💾 **Local Database** (SQLite/lowdb)
- [ ] 🔐 **User Authentication**
- [ ] 🌐 **Web Browser Component** (BrowserView)
- [ ] 📊 **System Monitor** (CPU, RAM, Disk usage)
- [ ] 🎨 **Theme Customization** (Dark/Light modes)
- [ ] 🔌 **Plugin System**
- [ ] 📡 **Cloud Sync**
- [ ] 🎯 **Keyboard Shortcuts Manager**

### Possible Integrations

- **OpenAI GPT** - Smarter voice assistant
- **Whisper** - Better speech recognition
- **Electron Store** - Persistent settings
- **Node SQLite** - Local database
- **Axios** - API requests
- **Socket.io** - Real-time features

---

## 📚 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Electron.js** | Desktop app framework |
| **Vite** | Fast build tool & dev server |
| **TypeScript** | Type-safe JavaScript |
| **Web Speech API** | Voice recognition & synthesis |
| **CSS3** | Modern styling with animations |
| **Electron Builder** | Package & distribute |

---

## 🐛 Troubleshooting

### App won't start in dev mode
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build fails
```bash
# Make sure all dependencies are installed
npm install electron-builder --save-dev
npm run build
```

### Voice not working
- Check browser/Electron supports Web Speech API
- Grant microphone permissions
- Try in Chrome-based browser first

### Windows look weird
- Clear browser cache
- Check console for CSS errors
- Verify all CSS files loaded

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Credits

Built with ❤️ using:
- [Electron](https://www.electronjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 📞 Support

Having issues? Want to contribute?

- 📧 Open an issue on GitHub
- 💬 Join the discussion
- 🌟 Star the repo if you like it!

---

<div align="center">

**Made with 🪄 by the Vox OS Team**

*Transform your web into a desktop experience!*

</div>
