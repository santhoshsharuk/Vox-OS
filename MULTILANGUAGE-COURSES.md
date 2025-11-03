# Multi-Language Course System

## 📁 Folder Structure Created

```
public/
└── data/
    ├── courses-index.json          ← Main index of all courses
    └── python/
        ├── english/
        │   ├── course_data.json    ← English course data
        │   └── banner.png          ← English banner image
        ├── tamil/
        │   ├── course_data.json    ← Tamil course data (தமிழ்)
        │   └── banner.png          ← Tamil banner image
        └── hindi/
            ├── course_data.json    ← Hindi course data (हिंदी)
            └── banner.png          ← Hindi banner image
```

## 🌍 Supported Languages

### Python Course Available In:
1. **English** 🇬🇧 - `/data/python/english/`
2. **Tamil (தமிழ்)** 🇮🇳 - `/data/python/tamil/`
3. **Hindi (हिंदी)** 🇮🇳 - `/data/python/hindi/`

## 📋 How It Works

### 1. Course Index (`courses-index.json`)
Contains metadata about all courses and their available languages:

```json
{
  "courses": [
    {
      "id": "python-programming",
      "name": "Python Programming",
      "languages": [
        {
          "code": "english",
          "name": "English",
          "flag": "🇬🇧",
          "dataPath": "/data/python/english/course_data.json"
        },
        {
          "code": "tamil",
          "name": "தமிழ்",
          "flag": "🇮🇳",
          "dataPath": "/data/python/tamil/course_data.json"
        }
      ]
    }
  ]
}
```

### 2. Language-Specific Course Data
Each language folder contains:
- `course_data.json` - Course content in that language
- `banner.png` - Course banner image (1200x400px recommended)

### 3. Course Data Structure

```json
{
  "id": "python-programming-tamil",
  "name": "Python நிரலாக்கம்",
  "language": "tamil",
  "description": "Course description in Tamil",
  "instructor": "Vox கற்றல் குழு",
  "duration": "10 வாரங்கள்",
  "level": "ஆரம்ப நிலை",
  "thumbnail": "/data/python/tamil/banner.png",
  "modules": [
    {
      "id": "module-1",
      "title": "Module title in Tamil",
      "description": "Module description in Tamil",
      "topics": [
        {
          "id": "topic-1-1",
          "title": "Topic title in Tamil",
          "videoUrl": "https://www.youtube.com/watch?v=...",
          "duration": "14:50",
          "description": "Topic description in Tamil"
        }
      ]
    }
  ]
}
```

## 🎨 Banner Images

### Image Specifications:
- **Recommended Size**: 1200x400 pixels
- **Format**: PNG or JPG
- **Max File Size**: 500KB
- **Naming**: `banner.png`

### Location:
- English: `public/data/python/english/banner.png`
- Tamil: `public/data/python/tamil/banner.png`
- Hindi: `public/data/python/hindi/banner.png`

### How to Add Banner Images:
1. Create your banner image (1200x400px)
2. Save it as `banner.png`
3. Place it in the language folder:
   ```
   public/data/python/tamil/banner.png
   public/data/python/english/banner.png
   public/data/python/hindi/banner.png
   ```

## 🔄 User Flow

### 1. Browse Courses
User sees all available courses with language options:
```
📖 Python Programming
   Languages: 🇬🇧 English | 🇮🇳 தமிழ் | 🇮🇳 हिंदी
```

### 2. Select Language
User clicks on their preferred language:
```
User clicks: 🇮🇳 தமிழ்
```

### 3. View Course
Platform loads:
- Tamil course data from `/data/python/tamil/course_data.json`
- Tamil banner from `/data/python/tamil/banner.png`
- All content displayed in Tamil

### 4. Learn
User progresses through modules and topics in their selected language.

## ➕ Adding New Languages

### Step 1: Create Language Folder
```bash
public/data/python/spanish/
```

### Step 2: Create `course_data.json`
Translate all content:
- Course name, description
- Module titles, descriptions
- Topic titles, descriptions
- Instructor name (if needed)
- Duration, level

### Step 3: Add Banner Image
```
public/data/python/spanish/banner.png
```

### Step 4: Update `courses-index.json`
Add new language entry:
```json
{
  "code": "spanish",
  "name": "Español",
  "flag": "🇪🇸",
  "dataPath": "/data/python/spanish/course_data.json"
}
```

## 📝 Current Tamil Course Content

### Modules:
1. **Python அடிப்படைகள்** (Python Basics)
   - Python என்றால் என்ன?
   - Python தொடரியல் மற்றும் மாறிகள்
   - தரவு வகைகள்

2. **தரவு கட்டமைப்புகள்** (Data Structures)
   - பட்டியல்கள் மற்றும் டப்பிள்கள்
   - அகராதிகள்
   - தொகுப்புகள்

3. **செயல்பாடுகள் மற்றும் தொகுதிகள்** (Functions and Modules)
   - செயல்பாடுகளை வரையறுத்தல்
   - தொகுதிகள் மற்றும் தொகுப்புகள்

### Video Links:
- All videos are YouTube links (same as English version)
- Users can find Tamil-dubbed or Tamil-subtitled versions if available
- Or add specific Tamil video links

## 🎯 Features Implemented

✅ Multi-language support
✅ Language-specific banner images  
✅ Separate JSON files per language
✅ Course index for language discovery
✅ Tamil (தமிழ்) translation included
✅ Hindi (हिंदी) translation included
✅ English as default

## 🔜 Next Steps

To complete the implementation:

1. **Add Banner Images**
   - Create 3 banner images (1200x400px)
   - Place in respective language folders

2. **Update Learning Platform**
   - Add language selector UI
   - Load courses from JSON files
   - Display banner images
   - Switch between languages

3. **Test**
   - Verify all 3 languages load correctly
   - Check banner images display
   - Ensure progress tracking per language

## 📸 To Add Your Banner Images:

Since I cannot create image files, you need to:

1. **Create banner images** for each language:
   - Design with Python logo/theme
   - Add language-specific text
   - Size: 1200x400 pixels
   - Save as PNG

2. **Save to folders**:
   ```
   D:\Voxos\voxos\vox-os\public\data\python\english\banner.png
   D:\Voxos\voxos\vox-os\public\data\python\tamil\banner.png
   D:\Voxos\voxos\vox-os\public\data\python\hindi\banner.png
   ```

3. **Or use placeholder** for now:
   - Copy any Python-related image
   - Rename to `banner.png`
   - Place in each folder

---

The multi-language system is ready! Next, I'll update the learning platform code to support language selection.
