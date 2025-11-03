# Complete App Access Guide - Vox OS

## 📖 Vox Learner Platform - Multiple Ways to Access

### Method 1: Desktop Icon (Recommended)
1. Wait for the splash screen to finish
2. Look at the desktop (top-left area)
3. Find the **📖 Vox Learner** icon
4. **Double-click** the icon
5. Platform opens!

### Method 2: Start Menu
1. Click the **Vox . OS logo** button (bottom-left corner of screen)
2. Start menu opens
3. Find **📖 Vox Learner** in the applications grid
4. **Single click** the tile
5. Platform opens!

### Method 3: Taskbar (When Already Open)
1. If you already opened it before
2. Look at the taskbar (bottom of screen)
3. Click the **📖 Vox Learner** button
4. Window restores if minimized

## All Available Apps

Here are all the apps you can access in Vox OS:

### Desktop Icons:
- 📁 **Files** - File explorer
- 🎵 **Music** - Music player
- 🖼️ **Photos** - Photo gallery
- ⚙️ **Settings** - System settings
- 🌐 **Browser** - Web browser
- **WhatsApp** - WhatsApp Web
- 📝 **Notes** - Markdown notes editor
- 📖 **Vox Learner** - Learning platform (NEW!)
- 🎮 **Games** - Games collection

### Start Menu Apps:
All the above apps PLUS you can access them from the start menu!

## Start Menu Usage

### Opening the Start Menu:
1. Click the **Vox . OS logo** in the bottom-left corner (taskbar)
2. Or press the **Windows key** on your keyboard
3. Start menu slides up from the bottom

### Closing the Start Menu:
- Click outside the menu
- Click the Vox . OS button again
- Press **Escape** key

### Start Menu Layout:
```
┌─────────────────────────────────┐
│  👤 Vox . OS User               │
├─────────────────────────────────┤
│  📱 Applications                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │📁  │ │🎵  │ │🖼️  │ │🌐  │  │
│  │File│ │Mus │ │Pho │ │Bro │  │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │WA  │ │📝  │ │📖  │ │🎮  │  │
│  │    │ │Not │ │Vox │ │Gam │  │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐                        │
│  │⚙️  │                        │
│  │Set │                        │
│  └────┘                        │
├─────────────────────────────────┤
│                      ⚡  ⚙️     │
└─────────────────────────────────┘
```

## Vox Learner Platform Features

Once you open it, you get:

### 📚 My Courses View (Default)
- **3 Pre-loaded Courses**:
  1. JavaScript Basics (Beginner, 8 weeks)
  2. Web Development Fundamentals (Beginner, 12 weeks)
  3. Python Programming (Beginner-Intermediate, 10 weeks)

- **Course Cards Show**:
  - Course name and level badge
  - Description
  - Instructor (Vox Learning Team)
  - Duration
  - Progress bar (0-100%)
  - "Start Course" or "Continue Learning" button

### 📊 Progress View
- View all course statistics
- Completed topics count
- Progress percentages
- Last accessed dates

### 🎥 Video Learning
- Click "Watch" on any topic
- YouTube video player opens
- Watch the lesson
- Click "Mark as Complete"
- Progress updates automatically!

## Window Management

### For Any App Window:
- **Move**: Click and drag the title bar
- **Minimize**: Click **−** button (top-right)
- **Maximize**: Click **□** button (top-right)
- **Close**: Click **✕** button (top-right)

### Taskbar Buttons:
- When an app is open, it appears in the taskbar
- Click the button to restore/focus the window
- Multiple windows can be open at once

## Complete Navigation Map

```
Vox OS Desktop
│
├─── Desktop Icons (Double-click to open)
│    ├── 📁 Files
│    ├── 🎵 Music
│    ├── 🖼️ Photos
│    ├── ⚙️ Settings
│    ├── 🌐 Browser
│    ├── WhatsApp
│    ├── 📝 Notes
│    ├── 📖 Vox Learner ← YOUR NEW APP!
│    └── 🎮 Games
│
├─── Start Menu (Click Vox logo bottom-left)
│    ├── User Profile (Top)
│    ├── Applications Grid (Middle)
│    │    ├── 📁 Files
│    │    ├── 🎵 Music
│    │    ├── 🖼️ Photos
│    │    ├── 🌐 Browser
│    │    ├── WhatsApp
│    │    ├── 📝 Notes
│    │    ├── 📖 Vox Learner ← YOUR NEW APP!
│    │    ├── 🎮 Games
│    │    └── ⚙️ Settings
│    └── Power/Settings Buttons (Bottom)
│
├─── Taskbar (Bottom of screen)
│    ├── Vox Logo (Start Menu)
│    ├── Search Box
│    ├── Open App Buttons
│    ├── Quick Actions
│    └── Clock/Date
│
└─── Voice Assistant (Click mic button)
     └── Voice commands for app control
```

## Troubleshooting

### "I don't see the Vox Learner icon on desktop"
1. Wait for splash screen to complete (13 seconds)
2. Check top-left area of desktop
3. Scroll/look for 📖 icon
4. Try using Start Menu instead

### "Start menu doesn't open"
1. Make sure you click the Vox . OS logo (bottom-left)
2. Try refreshing the page
3. Check browser console (F12) for errors

### "Vox Learner tile is not in Start Menu"
1. Refresh the page
2. Clear browser cache
3. Check that startmenu.ts has been updated
4. Look for console errors

### "App opens but shows nothing"
1. Open browser console (F12)
2. Look for these messages:
   - "Loading courses from embedded data..."
   - "Courses loaded: 3 courses"
   - "Courses displayed successfully"
3. Check for any error messages
4. Verify all files are loaded

## Data & Settings

### Your Progress:
- Saved in browser localStorage
- Persists across sessions
- Survives page refreshes
- Key: `voxos-learning-progress`

### Settings Location:
- Click ⚙️ Settings (desktop or start menu)
- Configure voice assistant
- Theme options (coming soon)

## Quick Reference

| Action | Method |
|--------|--------|
| Open Vox Learner | Double-click 📖 on desktop |
| Open Vox Learner | Click 📖 in Start Menu |
| Open Start Menu | Click Vox logo (bottom-left) |
| Close Window | Click ✕ on window |
| Minimize Window | Click − on window |
| Maximize Window | Click □ on window |
| View All Apps | Open Start Menu |
| Search Apps | Use search box in taskbar |

## Tips for Best Experience

1. **Start Menu is fastest** for accessing all apps
2. **Desktop icons** are good for frequently used apps
3. **Taskbar** shows what's currently running
4. **Voice assistant** can open apps by voice command
5. **Multiple windows** can be open at once
6. **Progress auto-saves** in Vox Learner

---

## Need More Help?

- Check the browser console (F12) for errors
- Look at `LEARNING-PLATFORM.md` for detailed docs
- See `HOW-TO-ACCESS-LEARNING.md` for Vox Learner guide
- Check `VOX-LEARNER-ACCESS.md` for troubleshooting

**Enjoy your learning journey with Vox Learner! 📖**
