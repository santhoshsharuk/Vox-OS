# Vox Learner Platform - Quick Access Guide

## ✅ Icon Updated!
The Learning Platform now uses the **📖 Vox Learner** icon and name.

## How to Access

### Step 1: Find the Icon
After the splash screen, look for the **📖 Vox Learner** icon on the desktop (top-left area).

### Step 2: Double-Click
Double-click the **📖 Vox Learner** icon to open the platform.

### Step 3: View Courses
The window will open with all available courses displayed.

## What You Should See

When the platform opens, you should see:

1. **Window Title**: "Vox Learner Platform" with 📖 icon
2. **Left Sidebar**:
   - 📚 My Courses (selected by default)
   - 📊 Progress
3. **Main Area**: 3 course cards showing:
   - JavaScript Basics
   - Web Development Fundamentals
   - Python Programming

## If You Don't See Courses

### Troubleshooting Steps:

1. **Open Browser Console** (Press F12)
   - Look for any errors
   - Check for the message: "Loading courses from embedded data..."
   - Should see: "Courses loaded: 3 courses"

2. **Check the Console Logs**:
   ```
   Loading courses from embedded data...
   Courses loaded: 3 courses
   Loading courses... 3 courses found
   Courses displayed successfully
   ```

3. **If you see "No courses available"**:
   - Check for import errors in console
   - Verify the courses-data.ts file exists
   - Try refreshing the page

4. **If the window is blank**:
   - Check CSS import errors (should be fixed now)
   - Look for JavaScript errors in console
   - Try closing and reopening the window

## Expected Layout

```
┌─────────────────────────────────────────────────┐
│ 📖 Vox Learner Platform          [−][□][✕]    │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ 📚 My    │  Available Courses                  │
│   Courses│                                      │
│          │  ┌──────────────┐ ┌──────────────┐ │
│ 📊 Pro   │  │ JavaScript   │ │ Web Dev      │ │
│   gress  │  │ Basics       │ │ Fundamentals │ │
│          │  │              │ │              │ │
│          │  │ Beginner     │ │ Beginner     │ │
│          │  │ 8 weeks      │ │ 12 weeks     │ │
│          │  │              │ │              │ │
│          │  │ [Progress]   │ │ [Progress]   │ │
│          │  │ Start Course │ │ Start Course │ │
│          │  └──────────────┘ └──────────────┘ │
│          │  ┌──────────────┐                  │
│          │  │ Python       │                  │
│          │  │ Programming  │                  │
│          │  └──────────────┘                  │
└──────────┴──────────────────────────────────────┘
```

## Course Features

Each course card shows:
- **Course Name** and **Level Badge** (e.g., "Beginner")
- **Description** of what you'll learn
- **Instructor**: Vox Learning Team
- **Duration**: Number of weeks
- **Progress Bar**: Shows completion percentage
- **Button**: "Start Course" (0% complete) or "Continue Learning" (>0% complete)

## Using the Platform

### To Start Learning:
1. Click **"Start Course"** on any course card
2. You'll see modules and topics
3. Click **"Watch"** on any topic
4. Video player opens with YouTube content
5. Click **"Mark as Complete"** after watching
6. Progress updates automatically!

### To Track Progress:
1. Click **"📊 Progress"** in the sidebar
2. See all your course statistics
3. View completed topics, percentages, and dates

## Debug Information

If courses don't appear, check the browser console for:
- ✅ "Loading courses from embedded data..."
- ✅ "Courses loaded: 3 courses"
- ✅ "Loading courses... 3 courses found"
- ✅ "Courses displayed successfully"

If you see errors:
- Take a screenshot of the console
- Check if courses-data.ts is properly imported
- Verify no TypeScript compilation errors

## Data Persistence

All your progress is saved in **localStorage** under the key:
```
voxos-learning-progress
```

You can view it in Browser DevTools > Application > Local Storage

## Quick Tips

- **Window Controls**: Drag the title bar to move, use buttons to minimize/maximize/close
- **Taskbar**: The platform appears in the taskbar when open
- **Progress Saves Automatically**: No need to manually save
- **Works Offline**: Once loaded, courses work without internet (but videos need internet)

---

## Still Not Working?

1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Clear browser cache** and reload
3. **Check the console** (F12) for any errors
4. **Verify files**:
   - `src/voxos/learning-platform.ts` exists
   - `src/voxos/learning-platform.css` exists
   - `src/voxos/courses-data.ts` exists
5. **Look for import errors** in the console

The platform should work immediately after opening. If you see a blank area where courses should be, check the console logs for debugging information!
