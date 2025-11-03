# Learning Platform Feature

## Overview
The Learning Platform is a comprehensive e-learning system integrated into Vox OS. It provides a complete learning management experience with course tracking, video lessons, and progress monitoring.

## Features

### 📚 Course Management
- Browse available courses
- View course details including modules and topics
- Access video lessons from YouTube
- Track learning progress per course

### 📊 Progress Tracking
- Automatic tracking of completed topics
- Visual progress indicators
- Course completion percentages
- Last accessed timestamps
- Persistent storage using localStorage

### 🎥 Video Player
- Integrated YouTube video player
- Mark topics as complete
- Track which videos have been watched
- Resume from where you left off

### 💾 User Activity Tracking
- All progress is saved locally
- Completed topics are tracked
- Progress percentages calculated automatically
- Last accessed course information

## Course Structure

Each course contains:
- **Course Information**: Name, description, instructor, duration, level
- **Modules**: Organized sections of the course
- **Topics**: Individual lessons with video links
- **Progress Data**: Completion status for each topic

## Data Storage

### Course Data Location
Course data is embedded in `src/voxos/courses-data.ts` with the following structure:

```typescript
{
  id: string
  name: string
  description: string
  instructor: string
  duration: string
  level: string
  thumbnail: string
  modules: [
    {
      id: string
      title: string
      description: string
      topics: [
        {
          id: string
          title: string
          videoUrl: string
          duration: string
          description: string
        }
      ]
    }
  ]
}
```

### Progress Data
User progress is stored in localStorage with the key: `voxos-learning-progress`

Structure:
```typescript
{
  userId: string
  courseId: string
  completedTopics: string[]
  lastAccessed: number (timestamp)
  progress: number (percentage)
}
```

## Adding New Courses

To add a new course:

1. Open `src/voxos/courses-data.ts`
2. Add a new course object to the `mockCoursesData` array following the structure above
3. Include YouTube video URLs for each topic
4. The platform will automatically recognize the new course

Example:
```typescript
{
  "id": "react-basics",
  "name": "React Fundamentals",
  "description": "Learn React from scratch",
  "instructor": "Vox Learning Team",
  "duration": "6 weeks",
  "level": "Intermediate",
  "thumbnail": "/courses/react.png",
  "modules": [
    {
      "id": "module-1",
      "title": "Getting Started with React",
      "description": "Introduction to React library",
      "topics": [
        {
          "id": "topic-1-1",
          "title": "What is React?",
          "videoUrl": "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
          "duration": "20:00",
          "description": "Understanding React basics"
        }
      ]
    }
  ]
}
```

## Current Courses

1. **JavaScript Basics** (Beginner, 8 weeks)
   - Introduction to JavaScript
   - Variables and Data Types
   - Functions and Control Flow

2. **Web Development Fundamentals** (Beginner, 12 weeks)
   - HTML Essentials
   - CSS Styling

3. **Python Programming** (Beginner to Intermediate, 10 weeks)
   - Python Basics
   - Data Structures

## User Interface

### Main Views
- **My Courses**: Browse and access all available courses
- **Progress**: View your learning statistics and completed topics

### Course Detail View
- Module breakdown
- Topic list with completion status
- Video duration indicators
- "Watch" or "Review" buttons for each topic

### Video Player
- Full-screen YouTube video integration
- "Mark as Complete" button
- Easy navigation back to course

## Implementation Details

### Files
- `src/voxos/learning-platform.ts` - Main platform logic
- `src/voxos/learning-platform.css` - Styling
- `src/voxos/courses-data.ts` - Course content
- `src/voxos/desktop.ts` - Desktop icon integration
- `src/voxos/windows.ts` - Window management integration

### Key Classes
- `LearningPlatform` - Core platform functionality
- `Course`, `Module`, `Topic` - Data interfaces
- `UserProgress` - Progress tracking interface

## Usage

1. Click the "Learning" icon (📚) on the desktop
2. Browse available courses
3. Click "Start Course" or "Continue Learning"
4. Select a topic to watch
5. Watch the video and mark as complete
6. Track your progress in the Progress view

## Future Enhancements

Potential additions:
- Quizzes and assessments
- Certificates of completion
- Course search and filtering
- User notes per topic
- Downloadable resources
- Multiple user profiles
- Course recommendations
- Completion badges
- Time spent tracking
- Course ratings and reviews

## Technical Notes

- Uses localStorage for persistence
- YouTube embed API for videos
- Responsive design
- Drag-and-drop window interface
- Real-time progress calculation
- Type-safe TypeScript implementation
