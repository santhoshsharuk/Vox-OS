# 🎓 Vox Learner - Quick Reference Card

## 📍 Current Status
✅ **UPGRADED** - Now loads courses from `public/data/` folder

## 🗂️ Key Files

| File | Purpose |
|------|---------|
| `public/data/courses-index.json` | Master course registry |
| `public/data/python/*/course_data.json` | Course content |
| `src/voxos/learning-platform.ts` | Main platform logic |
| `src/voxos/learning-platform.css` | Platform styling |
| `src/voxos/courses-data.ts` | Fallback embedded data |

## 📚 Available Courses

### Python Programming
- 🇬🇧 **English** - `/data/python/english/course_data.json`
- 🇮🇳 **Hindi** - `/data/python/hindi/course_data.json`
- 🇮🇳 **Tamil** - `/data/python/Tamil/course_data.json`

### Web Development (Embedded)
- 🇬🇧 **JavaScript Basics**
- 🇬🇧 **Web Development**

**Total**: 5 courses displayed (3 Python variants + 2 embedded)

## 🎯 Quick Actions

### To Add a New Course:
```bash
1. Create: public/data/your-course/language/course_data.json
2. Update: public/data/courses-index.json
3. Test in browser
```

### To Add a New Language:
```bash
1. Copy existing course_data.json
2. Translate all text fields
3. Update language field
4. Add to courses-index.json
```

### To Update Course Content:
```bash
1. Edit: public/data/course/language/course_data.json
2. Refresh browser
```

## 🔍 Troubleshooting

### Course Not Loading?
```bash
✓ Check courses-index.json syntax
✓ Verify file paths are correct
✓ Check browser console for errors
✓ Ensure JSON is valid (no trailing commas)
```

### Videos Not Playing?
```bash
✓ Verify YouTube video ID
✓ Check if video is embeddable
✓ Test URL in browser directly
```

### Progress Not Saving?
```bash
✓ Check localStorage in DevTools
✓ Clear cache and try again
✓ Verify course ID matches
```

## 📊 Course Data Template

```json
{
  "id": "unique-course-id-language",
  "name": "Course Name",
  "language": "english",
  "description": "Description...",
  "instructor": "Name",
  "duration": "X weeks",
  "level": "Beginner/Intermediate/Advanced",
  "thumbnail": "/data/path/banner.png",
  "modules": [
    {
      "id": "module-1",
      "title": "Module Title",
      "description": "Description",
      "topics": [
        {
          "id": "topic-1-1",
          "title": "Topic Title",
          "videoUrl": "https://youtube.com/watch?v=ID",
          "duration": "MM:SS",
          "description": "Description"
        }
      ]
    }
  ]
}
```

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `VOXLEARNER-STATUS.md` | Complete status summary |
| `LEARNING-PLATFORM-UPGRADE.md` | Technical upgrade details |
| `HOW-TO-ADD-COURSES.md` | Course creation guide |
| `COURSE-ARCHITECTURE.md` | System architecture |
| `QUICK-REFERENCE.md` | This file |

## 🎨 Course Card Features

Each course card displays:
- ✅ Thumbnail/banner image
- ✅ Course title
- ✅ Language badge (🌐 LANGUAGE)
- ✅ Level badge (Beginner/etc.)
- ✅ Description
- ✅ Instructor name
- ✅ Duration
- ✅ Module count (📚 X Modules)
- ✅ Progress bar (0-100%)
- ✅ Action button (Start/Continue)

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Build Electron app (if configured)
npm run electron:build
```

## 🌐 Supported Languages

| Code | Name | Flag | Status |
|------|------|------|--------|
| `english` | English | 🇬🇧 | ✅ Active |
| `hindi` | हिंदी | 🇮🇳 | ✅ Active |
| `tamil` | தமிழ் | 🇮🇳 | ✅ Active |
| `spanish` | Español | 🇪🇸 | ⚠️ Add as needed |
| `french` | Français | 🇫🇷 | ⚠️ Add as needed |

## 💾 Data Storage

**Location**: Browser localStorage
**Key**: `voxos-learning-progress`
**Format**: 
```json
{
  "default-user-course-id": {
    "userId": "default-user",
    "courseId": "course-id",
    "completedTopics": ["topic-1", "topic-2"],
    "lastAccessed": 1234567890,
    "progress": 25
  }
}
```

## 🎬 Video Platform

**Supported**: YouTube
**Format**: `https://www.youtube.com/watch?v=VIDEO_ID`
**Embed**: Auto-converted to embed URL
**Requirements**: Videos must be embeddable (not private/restricted)

## 📏 File Size Guidelines

- **course_data.json**: 50-500 KB (depends on course size)
- **bannerimg.png**: < 500 KB (recommended 800x450px)
- **courses-index.json**: < 50 KB

## ⚡ Performance Tips

1. ✅ Use optimized banner images (compress PNG/JPG)
2. ✅ Keep course descriptions concise (< 200 chars)
3. ✅ Limit modules per course (5-15 recommended)
4. ✅ Limit topics per module (3-8 recommended)
5. ✅ Use CDN for video hosting (YouTube)

## 🛡️ Best Practices

- ✅ Validate JSON before deployment
- ✅ Test in multiple browsers
- ✅ Keep backup of course data
- ✅ Use consistent naming conventions
- ✅ Document changes in README files
- ✅ Version control with Git

## 🔗 Useful Links

- **YouTube Video IDs**: Extract from URL after `?v=`
- **JSON Validator**: jsonlint.com
- **Image Optimizer**: tinypng.com
- **Emoji Reference**: emojipedia.org

## 📞 Quick Help

### Need to:
- **Add Course**: See `HOW-TO-ADD-COURSES.md`
- **Fix Issues**: Check browser console (F12)
- **Update Content**: Edit JSON files directly
- **View Architecture**: See `COURSE-ARCHITECTURE.md`
- **Check Status**: See `VOXLEARNER-STATUS.md`

---

**Last Updated**: November 2025
**Platform Version**: 2.0 (Multi-language Support)
**Status**: ✅ Production Ready
