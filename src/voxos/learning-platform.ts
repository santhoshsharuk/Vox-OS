// Learning Platform Component for Vox OS
// This module handles the learning platform functionality with multi-language support

import { mockCoursesData } from './courses-data'

export interface Topic {
  id: string
  title: string
  videoUrl: string
  duration: string
  description: string
  completed?: boolean
}

export interface Module {
  id: string
  title: string
  description: string
  topics: Topic[]
}

export interface Course {
  id: string
  name: string
  description: string
  instructor: string
  duration: string
  level: string
  thumbnail: string
  language?: string
  modules: Module[]
}

export interface LanguageOption {
  code: string
  name: string
  flag: string
  dataPath?: string
  embedded?: boolean
}

export interface CourseIndex {
  id: string
  name: string
  category: string
  languages: LanguageOption[]
}

export interface UserProgress {
  userId: string
  courseId: string
  completedTopics: string[]
  lastAccessed: number
  progress: number
}

class LearningPlatform {
  private courses: Course[] = []
  private courseIndex: CourseIndex[] = []
  private userProgress: Map<string, UserProgress> = new Map()
  private currentUser: string = 'default-user'
  private selectedLanguage: string = 'english'

  constructor() {
    this.loadProgress()
    this.loadCourseIndex()
  }

  async loadCourseIndex(): Promise<void> {
    try {
      const response = await fetch('/data/courses-index.json')
      if (response.ok) {
        const data = await response.json()
        this.courseIndex = data.courses || []
        console.log('Course index loaded:', this.courseIndex.length, 'courses')
      }
    } catch (error) {
      console.error('Error loading course index:', error)
    }
  }

  getCourseIndex(): CourseIndex[] {
    return this.courseIndex
  }

  setLanguage(language: string): void {
    this.selectedLanguage = language
    console.log('Language set to:', language)
  }

  getLanguage(): string {
    return this.selectedLanguage
  }

  async loadCourses(): Promise<Course[]> {
    try {
      console.log('Loading courses from multiple sources...')
      
      // Start with embedded courses
      this.courses = [...mockCoursesData as Course[]]
      
      // Load courses from course index (JSON files)
      if (this.courseIndex.length > 0) {
        for (const courseInfo of this.courseIndex) {
          // Check each language option
          for (const language of courseInfo.languages) {
            if (language.dataPath && !language.embedded) {
              try {
                console.log('Loading course from:', language.dataPath)
                const response = await fetch(language.dataPath)
                if (response.ok) {
                  const courseData = await response.json()
                  // Add language code to the course
                  courseData.languageCode = language.code
                  // Check if course already exists (avoid duplicates)
                  const exists = this.courses.find(c => c.id === courseData.id)
                  if (!exists) {
                    this.courses.push(courseData as Course)
                    console.log('Course loaded:', courseData.name, '(' + language.name + ')')
                  }
                }
              } catch (error) {
                console.error('Error loading course from', language.dataPath, ':', error)
              }
            }
          }
        }
      }
      
      console.log('Total courses loaded:', this.courses.length)
      return this.courses
    } catch (error) {
      console.error('Error loading courses:', error)
      return []
    }
  }

  async loadCourseByLanguage(courseId: string, languageCode: string): Promise<Course | null> {
    try {
      const courseInfo = this.courseIndex.find(c => c.id === courseId)
      if (!courseInfo) {
        console.error('Course not found in index:', courseId)
        return null
      }

      const language = courseInfo.languages.find(l => l.code === languageCode)
      if (!language) {
        console.error('Language not found for course:', languageCode)
        return null
      }

      if (language.embedded) {
        // Use embedded course data
        return this.courses.find(c => c.id.includes(courseId)) || null
      }

      if (language.dataPath) {
        // Load from JSON file
        console.log('Loading course from:', language.dataPath)
        const response = await fetch(language.dataPath)
        if (response.ok) {
          const courseData = await response.json()
          console.log('Course loaded:', courseData.name)
          return courseData as Course
        }
      }

      return null
    } catch (error) {
      console.error('Error loading course by language:', error)
      return null
    }
  }

  getCourses(): Course[] {
    return this.courses
  }

  getCourse(courseId: string): Course | undefined {
    return this.courses.find(c => c.id === courseId)
  }

  getUserProgress(courseId: string): UserProgress {
    const key = `${this.currentUser}-${courseId}`
    if (!this.userProgress.has(key)) {
      const progress: UserProgress = {
        userId: this.currentUser,
        courseId,
        completedTopics: [],
        lastAccessed: Date.now(),
        progress: 0
      }
      this.userProgress.set(key, progress)
    }
    return this.userProgress.get(key)!
  }

  markTopicComplete(courseId: string, topicId: string): void {
    const progress = this.getUserProgress(courseId)
    
    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId)
      progress.lastAccessed = Date.now()
      
      const course = this.getCourse(courseId)
      if (course) {
        const totalTopics = course.modules.reduce((sum, m) => sum + m.topics.length, 0)
        progress.progress = (progress.completedTopics.length / totalTopics) * 100
      }
      
      this.saveProgress()
    }
  }

  isTopicCompleted(courseId: string, topicId: string): boolean {
    const progress = this.getUserProgress(courseId)
    return progress.completedTopics.includes(topicId)
  }

  private saveProgress(): void {
    const progressData: any = {}
    this.userProgress.forEach((value, key) => {
      progressData[key] = value
    })
    localStorage.setItem('voxos-learning-progress', JSON.stringify(progressData))
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('voxos-learning-progress')
    if (saved) {
      try {
        const progressData = JSON.parse(saved)
        Object.entries(progressData).forEach(([key, value]) => {
          this.userProgress.set(key, value as UserProgress)
        })
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }
  }

  getCourseProgress(courseId: string): number {
    const progress = this.getUserProgress(courseId)
    return progress.progress
  }

  getAllProgress(): UserProgress[] {
    return Array.from(this.userProgress.values())
  }
}

export const learningPlatform = new LearningPlatform()

export function createLearningPlatformWindow(): void {
  const windowsContainer = document.getElementById('windows-container')
  if (!windowsContainer) return

  // Check if learning platform window already exists
  const existingWindow = document.getElementById('window-learning')
  if (existingWindow) {
    existingWindow.classList.remove('minimized')
    existingWindow.style.zIndex = String(Date.now())
    return
  }

  const windowId = 'window-learning'
  
  const windowEl = document.createElement('div')
  windowEl.className = 'app-window active'
  windowEl.id = windowId
  windowEl.style.width = '1000px'
  windowEl.style.height = '700px'
  windowEl.style.left = '100px'
  windowEl.style.top = '80px'
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <span class="window-icon">📖</span>
        <span>Vox Learner Platform</span>
      </div>
      <div class="window-controls">
        <button class="window-btn minimize-btn">−</button>
        <button class="window-btn maximize-btn">□</button>
        <button class="window-btn close-btn">✕</button>
      </div>
    </div>
    <div class="window-content learning-platform">
      <div class="learning-sidebar">
        <div class="learning-nav">
          <button class="nav-btn active" data-view="courses">
            📚 My Courses
          </button>
          <button class="nav-btn" data-view="progress">
            📊 Progress
          </button>
        </div>
      </div>
      <div class="learning-main">
        <div id="courses-view" class="learning-view active">
          <h2>Available Courses</h2>
          <div id="courses-list" class="courses-grid">
            Loading courses...
          </div>
        </div>
        <div id="progress-view" class="learning-view">
          <h2>Your Progress</h2>
          <div id="progress-list">
            Loading progress...
          </div>
        </div>
        <div id="course-detail" class="learning-view">
          <!-- Course detail view -->
        </div>
      </div>
    </div>
  `

  windowsContainer.appendChild(windowEl)
  
  setupWindowControls(windowEl)
  setupLearningPlatform(windowEl)
  
  // Add to taskbar
  addToTaskbar('learning', 'Vox Learner')
  
  loadAndDisplayCourses()
}

function setupWindowControls(windowEl: HTMLElement): void {
  const closeBtn = windowEl.querySelector('.close-btn')
  const minimizeBtn = windowEl.querySelector('.minimize-btn')
  const maximizeBtn = windowEl.querySelector('.maximize-btn')
  const titlebar = windowEl.querySelector('.window-titlebar')

  closeBtn?.addEventListener('click', () => {
    windowEl.remove()
    removeFromTaskbar('learning')
  })
  minimizeBtn?.addEventListener('click', () => windowEl.classList.toggle('minimized'))
  maximizeBtn?.addEventListener('click', () => windowEl.classList.toggle('maximized'))

  let isDragging = false
  let offsetX = 0
  let offsetY = 0
  let rafId: number | null = null

  titlebar?.addEventListener('mousedown', (e) => {
    if ((e.target as HTMLElement).closest('.window-btn')) return
    
    isDragging = true
    const rect = windowEl.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
    
    windowEl.style.cursor = 'move'
    windowEl.style.willChange = 'transform'
    
    // Disable transitions during drag for immediate response
    windowEl.style.transition = 'none'
    
    e.preventDefault()
    e.stopPropagation()
  })

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault()
      
      // Cancel previous frame if still pending
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      
      // Use requestAnimationFrame for smooth animation
      rafId = requestAnimationFrame(() => {
        const newX = e.clientX - offsetX
        const newY = e.clientY - offsetY
        
        windowEl.style.left = `${newX}px`
        windowEl.style.top = `${newY}px`
        
        rafId = null
      })
    }
  })

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false
      windowEl.style.cursor = ''
      windowEl.style.willChange = 'auto'
      
      // Re-enable transitions
      windowEl.style.transition = ''
      
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  })
}

function addToTaskbar(appId: string, title: string): void {
  const taskbarApps = document.getElementById('taskbar-apps')
  if (!taskbarApps) return
  
  // Check if already in taskbar
  if (document.getElementById(`taskbar-${appId}`)) return
  
  const btn = document.createElement('button')
  btn.className = 'taskbar-app-btn active'
  btn.id = `taskbar-${appId}`
  btn.innerHTML = `
    <span>📖</span>
    <span class="taskbar-app-label">${title}</span>
  `
  btn.addEventListener('click', () => {
    const windowEl = document.getElementById('window-learning')
    if (windowEl) {
      windowEl.classList.remove('minimized')
      windowEl.style.zIndex = String(Date.now())
    }
  })
  taskbarApps.appendChild(btn)
}

function removeFromTaskbar(appId: string): void {
  const btn = document.getElementById(`taskbar-${appId}`)
  btn?.remove()
}

function setupLearningPlatform(windowEl: HTMLElement): void {
  const navBtns = windowEl.querySelectorAll('.nav-btn')
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view')
      
      navBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      
      const views = windowEl.querySelectorAll('.learning-view')
      views.forEach(v => v.classList.remove('active'))
      
      if (view === 'courses') {
        windowEl.querySelector('#courses-view')?.classList.add('active')
      } else if (view === 'progress') {
        windowEl.querySelector('#progress-view')?.classList.add('active')
        displayProgress(windowEl)
      }
    })
  })
}

async function loadAndDisplayCourses(): Promise<void> {
  const courses = await learningPlatform.loadCourses()
  const coursesList = document.getElementById('courses-list')
  
  console.log('Loading courses...', courses.length, 'courses found')
  
  if (!coursesList) {
    console.error('courses-list element not found')
    return
  }

  if (courses.length === 0) {
    coursesList.innerHTML = '<p style="padding: 20px; color: #666;">No courses available. Please check console for errors.</p>'
    return
  }

  coursesList.innerHTML = courses.map(course => {
    const progress = learningPlatform.getCourseProgress(course.id)
    
    // Display banner/thumbnail if available
    const thumbnailHtml = course.thumbnail ? 
      `<img src="${course.thumbnail}" class="course-thumbnail" alt="${course.name}" onerror="this.style.display='none'">` : ''
    
    // Show language badge if specified
    const languageBadge = course.language ? 
      `<span class="course-language-badge">🌐 ${course.language.toUpperCase()}</span>` : ''
    
    return `
      <div class="course-card" data-course-id="${course.id}">
        ${thumbnailHtml}
        <div class="course-header">
          <h3>${course.name}</h3>
          <div class="course-badges">
            <span class="course-level">${course.level}</span>
            ${languageBadge}
          </div>
        </div>
        <p class="course-description">${course.description}</p>
        <div class="course-info">
          <span>👤 ${course.instructor}</span>
          <span>⏱️ ${course.duration}</span>
          <span>📚 ${course.modules.length} Modules</span>
        </div>
        <div class="course-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${Math.round(progress)}% Complete</span>
        </div>
        <button class="btn-primary open-course-btn" data-course-id="${course.id}">
          ${progress > 0 ? 'Continue Learning' : 'Start Course'}
        </button>
      </div>
    `
  }).join('')

  console.log('Courses displayed successfully')

  coursesList.querySelectorAll('.open-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id')
      if (courseId) {
        openCourseDetail(courseId)
      }
    })
  })
}

function openCourseDetail(courseId: string): void {
  const course = learningPlatform.getCourse(courseId)
  if (!course) return

  const courseDetailView = document.getElementById('course-detail')
  if (!courseDetailView) return

  courseDetailView.innerHTML = `
    <div class="course-detail-header">
      <button class="back-btn">← Back to Courses</button>
      <h2>${course.name}</h2>
    </div>
    <div class="course-modules">
      ${course.modules.map((module, moduleIndex) => `
        <div class="module-card">
          <h3>Module ${moduleIndex + 1}: ${module.title}</h3>
          <p>${module.description}</p>
          <div class="topics-list">
            ${module.topics.map(topic => {
              const isCompleted = learningPlatform.isTopicCompleted(courseId, topic.id)
              return `
                <div class="topic-item ${isCompleted ? 'completed' : ''}">
                  <div class="topic-info">
                    <span class="topic-status">${isCompleted ? '✅' : '⭕'}</span>
                    <div class="topic-details">
                      <h4>${topic.title}</h4>
                      <p>${topic.description}</p>
                      <span class="topic-duration">⏱️ ${topic.duration}</span>
                    </div>
                  </div>
                  <button class="btn-secondary watch-btn" data-course-id="${courseId}" data-topic-id="${topic.id}" data-video-url="${topic.videoUrl}">
                    ${isCompleted ? 'Review' : 'Watch'}
                  </button>
                </div>
              `
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `

  courseDetailView.querySelector('.back-btn')?.addEventListener('click', () => {
    courseDetailView.classList.remove('active')
    document.getElementById('courses-view')?.classList.add('active')
  })

  courseDetailView.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id')
      const topicId = btn.getAttribute('data-topic-id')
      const videoUrl = btn.getAttribute('data-video-url')
      
      if (courseId && topicId && videoUrl) {
        openVideoPlayer(courseId, topicId, videoUrl)
      }
    })
  })

  const views = document.querySelectorAll('.learning-view')
  views.forEach(v => v.classList.remove('active'))
  courseDetailView.classList.add('active')
}

function openVideoPlayer(courseId: string, topicId: string, videoUrl: string): void {
  const videoId = extractYouTubeVideoId(videoUrl)
  if (!videoId) {
    alert('Invalid video URL')
    return
  }

  const playerWindow = document.createElement('div')
  playerWindow.className = 'video-player-window'
  playerWindow.innerHTML = `
    <div class="video-player-header">
      <h3>Video Player</h3>
      <button class="close-player-btn">×</button>
    </div>
    <div class="video-player-content">
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-player-footer">
      <button class="btn-primary mark-complete-btn" data-course-id="${courseId}" data-topic-id="${topicId}">
        Mark as Complete
      </button>
    </div>
  `

  document.body.appendChild(playerWindow)

  playerWindow.querySelector('.close-player-btn')?.addEventListener('click', () => {
    playerWindow.remove()
  })

  playerWindow.querySelector('.mark-complete-btn')?.addEventListener('click', () => {
    learningPlatform.markTopicComplete(courseId, topicId)
    playerWindow.remove()
    openCourseDetail(courseId)
  })
}

function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function displayProgress(windowEl: HTMLElement): void {
  const progressList = windowEl.querySelector('#progress-list')
  if (!progressList) return

  const allProgress = learningPlatform.getAllProgress()
  
  if (allProgress.length === 0) {
    progressList.innerHTML = '<p>No progress yet. Start a course to track your learning!</p>'
    return
  }

  progressList.innerHTML = allProgress.map(progress => {
    const course = learningPlatform.getCourse(progress.courseId)
    if (!course) return ''

    return `
      <div class="progress-card">
        <h3>${course.name}</h3>
        <div class="progress-stats">
          <div class="stat">
            <span class="stat-label">Completed Topics</span>
            <span class="stat-value">${progress.completedTopics.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Progress</span>
            <span class="stat-value">${Math.round(progress.progress)}%</span>
          </div>
          <div class="stat">
            <span class="stat-label">Last Accessed</span>
            <span class="stat-value">${new Date(progress.lastAccessed).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.progress}%"></div>
        </div>
      </div>
    `
  }).join('')
}
