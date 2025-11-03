# Learning Platform - Visual Structure Guide

```
📁 Vox OS
│
├── 🖥️ Desktop
│   └── 📚 Learning Icon (NEW)
│       └── Opens Learning Platform Window
│
├── 🪟 Learning Platform Window
│   │
│   ├── 📊 Sidebar Navigation
│   │   ├── 📚 My Courses (View all courses)
│   │   └── 📈 Progress (Track learning stats)
│   │
│   └── 📄 Main Content Area
│       │
│       ├── 🎓 My Courses View
│       │   └── Course Cards Grid
│       │       ├── Course 1: JavaScript Basics
│       │       ├── Course 2: Web Development
│       │       └── Course 3: Python Programming
│       │
│       ├── 📖 Course Detail View
│       │   └── Module List
│       │       └── Topic List
│       │           ├── ⭕ Incomplete Topic
│       │           └── ✅ Completed Topic
│       │
│       └── 📊 Progress View
│           └── Statistics Cards
│               ├── Completed Topics Count
│               ├── Progress Percentage
│               └── Last Accessed Date
│
└── 🎬 Video Player Modal (Opens on topic click)
    ├── YouTube Video Embed
    └── "Mark as Complete" Button
```

## Course Data Structure

```
📚 Course
│
├── 📝 Course Info
│   ├── ID
│   ├── Name
│   ├── Description
│   ├── Instructor
│   ├── Duration
│   └── Level
│
└── 📑 Modules Array
    │
    ├── 📘 Module 1
    │   ├── Module Info (ID, Title, Description)
    │   └── 🎯 Topics Array
    │       ├── 🎥 Topic 1 (Video, Duration, Description)
    │       ├── 🎥 Topic 2
    │       └── 🎥 Topic 3
    │
    └── 📘 Module 2
        ├── Module Info
        └── 🎯 Topics Array
            ├── 🎥 Topic 1
            └── 🎥 Topic 2
```

## User Progress Tracking

```
💾 localStorage
│
└── "voxos-learning-progress"
    │
    ├── User-Course-1 Progress
    │   ├── User ID: "default-user"
    │   ├── Course ID: "javascript-basics"
    │   ├── Completed Topics: ["topic-1-1", "topic-2-1"]
    │   ├── Progress: 25%
    │   └── Last Accessed: 1699000000000
    │
    ├── User-Course-2 Progress
    │   ├── User ID: "default-user"
    │   ├── Course ID: "web-development"
    │   ├── Completed Topics: ["topic-1-1"]
    │   ├── Progress: 50%
    │   └── Last Accessed: 1699000001000
    │
    └── User-Course-3 Progress
        └── ... (same structure)
```

## User Flow Diagram

```
Start
  │
  ├──> Click 📚 Learning Icon on Desktop
  │
  ├──> Learning Platform Window Opens
  │
  ├──> View "My Courses" (Default View)
  │     │
  │     ├──> Browse Course Cards
  │     │     └──> See Progress Bar per Course
  │     │
  │     └──> Click "Start Course" / "Continue Learning"
  │           │
  │           ├──> Course Detail View Opens
  │           │     │
  │           │     ├──> View Modules & Topics
  │           │     │     └──> See ⭕ (not done) or ✅ (done)
  │           │     │
  │           │     └──> Click "Watch" on a Topic
  │           │           │
  │           │           ├──> Video Player Modal Opens
  │           │           │     │
  │           │           │     ├──> Watch YouTube Video
  │           │           │     │
  │           │           │     └──> Click "Mark as Complete"
  │           │           │           │
  │           │           │           ├──> Topic marked as ✅
  │           │           │           ├──> Progress % updates
  │           │           │           ├──> Data saved to localStorage
  │           │           │           └──> Return to Course Detail
  │           │           │
  │           │           └──> Close Video Player
  │           │                 └──> Back to Course Detail
  │           │
  │           └──> Click "← Back to Courses"
  │                 └──> Return to My Courses View
  │
  └──> Switch to "Progress" Tab
        │
        └──> View All Course Statistics
              ├──> Completed Topics Count
              ├──> Progress Percentage
              └──> Last Accessed Date
```

## Component Architecture

```
┌─────────────────────────────────────────┐
│     learning-platform.ts (Main File)    │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   LearningPlatform Class          │ │
│  ├───────────────────────────────────┤ │
│  │ - courses: Course[]               │ │
│  │ - userProgress: Map<>             │ │
│  │ - currentUser: string             │ │
│  │                                   │ │
│  │ Methods:                          │ │
│  │ - loadCourses()                   │ │
│  │ - getCourse()                     │ │
│  │ - getUserProgress()               │ │
│  │ - markTopicComplete()             │ │
│  │ - isTopicCompleted()              │ │
│  │ - saveProgress()                  │ │
│  │ - loadProgress()                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   UI Functions                    │ │
│  ├───────────────────────────────────┤ │
│  │ - createLearningPlatformWindow()  │ │
│  │ - setupWindowControls()           │ │
│  │ - setupLearningPlatform()         │ │
│  │ - loadAndDisplayCourses()         │ │
│  │ - openCourseDetail()              │ │
│  │ - openVideoPlayer()               │ │
│  │ - displayProgress()               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
         │                    │
         ↓                    ↓
┌──────────────────┐   ┌──────────────────┐
│  courses-data.ts │   │ learning-       │
│  (Data Source)   │   │ platform.css    │
│                  │   │ (Styles)        │
└──────────────────┘   └──────────────────┘
```

## File Integration

```
Vox OS File Structure:

src/
├── main.ts
│   └── imports voxos/init.ts
│
├── style.css
│   └── imports voxos/learning-platform.css
│
└── voxos/
    ├── init.ts
    ├── desktop.ts        ← Modified (Added Learning icon)
    ├── windows.ts        ← Modified (Added Learning window handling)
    ├── learning-platform.ts  ← NEW (Main logic)
    ├── learning-platform.css ← NEW (Styles)
    └── courses-data.ts   ← NEW (Course content)
```

## State Management Flow

```
User Action
    │
    ↓
Event Handler
    │
    ↓
LearningPlatform Class Method
    │
    ├──> Update Internal State
    │     (courses, userProgress)
    │
    ├──> Update localStorage
    │     (persist data)
    │
    └──> Update UI
          (DOM manipulation)
    │
    ↓
User Sees Updated Interface
```

## Example: Marking a Topic Complete

```
1. User clicks "Watch" button
   └──> openVideoPlayer(courseId, topicId, videoUrl)

2. Video modal opens with YouTube embed

3. User clicks "Mark as Complete"
   └──> learningPlatform.markTopicComplete(courseId, topicId)
        │
        ├──> Get/Create UserProgress for course
        │
        ├──> Add topicId to completedTopics[]
        │
        ├──> Update lastAccessed timestamp
        │
        ├──> Calculate new progress percentage
        │     = (completedTopics / totalTopics) * 100
        │
        ├──> saveProgress()
        │     └──> localStorage.setItem('voxos-learning-progress', data)
        │
        └──> Refresh UI
             └──> openCourseDetail(courseId) to show ✅

4. User sees topic marked with ✅ checkmark

5. Progress bar updates automatically
```

## CSS Class Structure

```
.learning-platform          ← Main container
  │
  ├── .learning-sidebar     ← Left sidebar
  │   └── .learning-nav     ← Navigation buttons
  │       └── .nav-btn      ← Individual nav button
  │
  └── .learning-main        ← Main content area
      │
      ├── .learning-view    ← View container
      │   │
      │   ├── .courses-grid       ← Course cards layout
      │   │   └── .course-card    ← Individual course
      │   │       ├── .course-header
      │   │       ├── .course-description
      │   │       ├── .course-info
      │   │       ├── .course-progress
      │   │       │   ├── .progress-bar
      │   │       │   └── .progress-fill
      │   │       └── .btn-primary
      │   │
      │   ├── .course-modules     ← Module list
      │   │   └── .module-card    ← Individual module
      │   │       └── .topics-list
      │   │           └── .topic-item
      │   │               ├── .topic-info
      │   │               └── .watch-btn
      │   │
      │   └── .progress-card      ← Progress statistics
      │       ├── .progress-stats
      │       └── .progress-bar
      │
      └── .video-player-window    ← Video modal
          ├── .video-player-header
          ├── .video-player-content
          └── .video-player-footer
```

---

This visual guide shows how all the components work together to create a complete learning platform experience!
