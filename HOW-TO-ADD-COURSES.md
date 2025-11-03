# How to Add New Courses to Vox Learner

This guide explains how to add new courses to the Vox Learner platform using the file-based course system.

## 📋 Quick Steps

### 1. Create Course Folder Structure

Create a new folder under `public/data/` for your course:

```
public/data/
├── python/          (existing)
├── javascript/      (new course example)
│   ├── english/
│   │   ├── course_data.json
│   │   ├── bannerimg.png
│   │   └── README.md
│   ├── hindi/
│   │   ├── course_data.json
│   │   └── README.md
│   └── tamil/
│       ├── course_data.json
│       └── README.md
```

### 2. Create Course Data JSON

Create a `course_data.json` file for each language. Use this template:

```json
{
  "id": "unique-course-id-language",
  "name": "Course Name",
  "language": "english",
  "description": "Course description goes here",
  "instructor": "Instructor Name",
  "duration": "X weeks",
  "level": "Beginner/Intermediate/Advanced",
  "thumbnail": "/data/coursename/language/bannerimg.png",
  "modules": [
    {
      "id": "module-1",
      "title": "Module Title",
      "description": "Module description",
      "topics": [
        {
          "id": "topic-1-1",
          "title": "Topic Title",
          "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
          "duration": "15:30",
          "description": "Topic description"
        }
      ]
    }
  ]
}
```

### 3. Update Course Index

Edit `public/data/courses-index.json` and add your course:

```json
{
  "courses": [
    {
      "id": "your-course-id",
      "name": "Your Course Name",
      "category": "programming",
      "languages": [
        {
          "code": "english",
          "name": "English",
          "flag": "🇬🇧",
          "dataPath": "/data/your-course/english/course_data.json"
        },
        {
          "code": "hindi",
          "name": "हिंदी",
          "flag": "🇮🇳",
          "dataPath": "/data/your-course/hindi/course_data.json"
        }
      ]
    }
  ]
}
```

### 4. Add Course Banner (Optional)

Place a banner image named `bannerimg.png` in each language folder:
- Recommended size: 800x450 pixels
- Format: PNG or JPG
- Aspect ratio: 16:9

## 📝 Course Data Guidelines

### Course ID Naming
- Format: `course-name-language`
- Example: `python-programming-english`, `web-dev-tamil`
- Must be unique across all courses

### Module Structure
- Each course should have 5-15 modules
- Each module should have 3-8 topics
- Topics are individual video lessons

### Video URLs
- Use YouTube video links
- Format: `https://www.youtube.com/watch?v=VIDEO_ID`
- The platform automatically converts to embed format

### Duration Format
- Format: `MM:SS` (e.g., "15:30", "1:25:45")
- Be accurate for better user experience

## 🌍 Multi-Language Support

### Adding a New Language

1. Create language folder in your course directory
2. Copy course_data.json from another language
3. Translate all text fields:
   - `name`
   - `description`
   - Module `title` and `description`
   - Topic `title` and `description`
4. Update the `language` field
5. Add to course index with proper flag emoji

### Language Codes
- `english` - 🇬🇧
- `hindi` - 🇮🇳
- `tamil` - 🇮🇳
- `spanish` - 🇪🇸
- `french` - 🇫🇷
- etc.

## ✅ Testing Your Course

1. Build and run the application
2. Open Vox Learner from desktop
3. Check if your course appears in the courses list
4. Click to open and verify all modules load
5. Test video playback for a few topics

## 🔍 Troubleshooting

### Course Not Showing Up
- Check `courses-index.json` for correct path
- Verify JSON syntax (no trailing commas)
- Check browser console for errors
- Ensure course ID is unique

### Videos Not Playing
- Verify YouTube video IDs are correct
- Check if videos are embeddable (not private/restricted)
- Test video URLs in browser first

### Thumbnails Not Loading
- Check image path in course_data.json
- Ensure image file exists in correct location
- Verify image format (PNG/JPG supported)
- Check for typos in filename

## 📚 Example Course Categories

- **Programming**: Python, JavaScript, Java, C++
- **Web Development**: HTML/CSS, React, Node.js
- **Mobile**: Flutter, React Native, Android
- **Data Science**: Machine Learning, Data Analysis
- **Design**: UI/UX, Graphic Design
- **Business**: Marketing, Management

## 🎯 Best Practices

1. **Consistent Structure**: Keep module/topic structure consistent
2. **Clear Descriptions**: Write clear, concise descriptions
3. **Quality Videos**: Use high-quality educational videos
4. **Logical Progression**: Order topics from basic to advanced
5. **Regular Updates**: Keep course content up to date
6. **Test Thoroughly**: Test in all language variants

## 🚀 Advanced Features

### Embedded vs File-Based Courses
- File-based: Load from JSON (preferred for new courses)
- Embedded: Hardcoded in `courses-data.ts` (fallback only)

### Progress Tracking
- Automatically handled by the platform
- Tracked per course ID
- Saved in localStorage

### Course Prerequisites
Currently not implemented but can be added in future versions.

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify JSON syntax using online validators
3. Review existing course files as examples
4. Check file paths are correct (case-sensitive)

Happy Course Creation! 🎓
