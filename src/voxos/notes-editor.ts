// Notes Editor with Monaco Editor and Markdown Support
import * as monaco from 'monaco-editor'
import { marked } from 'marked'

// Use CDN for Monaco Editor workers (more reliable in dev)
;(window as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') {
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/language/json/json.worker.js'
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/language/css/css.worker.js'
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/language/html/html.worker.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/language/typescript/ts.worker.js'
    }
    return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/editor/editor.worker.js'
  }
}

export class NotesEditor {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null
  private currentFile: string = 'untitled.md'
  private autoSaveTimer: number | null = null
  private previewMode: 'split' | 'edit' | 'preview' = 'split'

  constructor(private containerId: string) {
    this.init()
  }

  private init() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    // Load saved content
    const savedContent = this.loadContent(this.currentFile)

    // Create toolbar
    const toolbar = this.createToolbar()
    container.appendChild(toolbar)

    // Create editor container
    const editorWrapper = document.createElement('div')
    editorWrapper.style.cssText = 'display: flex; height: calc(100% - 50px); overflow: hidden;'
    container.appendChild(editorWrapper)

    // Create editor pane
    const editorPane = document.createElement('div')
    editorPane.id = 'notes-editor-pane'
    editorPane.style.cssText = 'flex: 1; height: 100%; border-right: 1px solid rgba(255,255,255,0.1);'
    editorWrapper.appendChild(editorPane)

    // Create preview pane
    const previewPane = document.createElement('div')
    previewPane.id = 'notes-preview-pane'
    previewPane.className = 'markdown-preview'
    previewPane.style.cssText = 'flex: 1; height: 100%; overflow-y: auto; padding: 20px; background: rgba(0,0,0,0.2);'
    editorWrapper.appendChild(previewPane)

    // Initialize Monaco Editor
    this.editor = monaco.editor.create(editorPane, {
      value: savedContent,
      language: 'markdown',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: true },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      padding: { top: 10, bottom: 10 }
    })

    // Update preview on content change
    this.editor.onDidChangeModelContent(() => {
      this.updatePreview()
      this.scheduleAutoSave()
    })

    // Initial preview update
    this.updatePreview()

    // Load file list
    this.updateFileList()
  }

  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: rgba(0,0,0,0.3);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      gap: 10px;
    `

    // Left side - File operations
    const leftSide = document.createElement('div')
    leftSide.style.cssText = 'display: flex; gap: 8px; align-items: center;'

    const fileNameInput = document.createElement('input')
    fileNameInput.type = 'text'
    fileNameInput.value = this.currentFile
    fileNameInput.id = 'notes-filename'
    fileNameInput.style.cssText = `
      padding: 6px 12px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      color: white;
      font-size: 13px;
      width: 200px;
    `
    fileNameInput.addEventListener('change', () => {
      this.renameFile(fileNameInput.value)
    })

    const newBtn = this.createButton('📄 New', () => this.newFile())
    const saveBtn = this.createButton('💾 Save', () => this.saveFile())
    const filesBtn = this.createButton('📁 Files', () => this.toggleFileList())

    leftSide.append(fileNameInput, newBtn, saveBtn, filesBtn)

    // Right side - View options
    const rightSide = document.createElement('div')
    rightSide.style.cssText = 'display: flex; gap: 8px;'

    const editBtn = this.createButton('✏️ Edit', () => this.setPreviewMode('edit'))
    const splitBtn = this.createButton('⚡ Split', () => this.setPreviewMode('split'))
    const previewBtn = this.createButton('👁️ Preview', () => this.setPreviewMode('preview'))
    const exportBtn = this.createButton('📥 Export', () => this.exportFile())

    rightSide.append(editBtn, splitBtn, previewBtn, exportBtn)

    toolbar.append(leftSide, rightSide)
    return toolbar
  }

  private createButton(text: string, onClick: () => void): HTMLElement {
    const btn = document.createElement('button')
    btn.textContent = text
    btn.style.cssText = `
      padding: 6px 12px;
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-radius: 6px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    `
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(59, 130, 246, 0.3)'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(59, 130, 246, 0.2)'
    })
    btn.addEventListener('click', onClick)
    return btn
  }

  private updatePreview() {
    if (!this.editor) return

    const content = this.editor.getValue()
    const previewPane = document.getElementById('notes-preview-pane')
    if (previewPane) {
      previewPane.innerHTML = marked.parse(content) as string
    }
  }

  private setPreviewMode(mode: 'split' | 'edit' | 'preview') {
    this.previewMode = mode
    const editorPane = document.getElementById('notes-editor-pane')
    const previewPane = document.getElementById('notes-preview-pane')

    if (!editorPane || !previewPane) return

    switch (mode) {
      case 'edit':
        editorPane.style.flex = '1'
        previewPane.style.display = 'none'
        break
      case 'preview':
        editorPane.style.display = 'none'
        previewPane.style.flex = '1'
        previewPane.style.display = 'block'
        break
      case 'split':
        editorPane.style.flex = '1'
        editorPane.style.display = 'block'
        previewPane.style.flex = '1'
        previewPane.style.display = 'block'
        break
    }

    if (this.editor) {
      this.editor.layout()
    }
  }

  private newFile() {
    if (this.editor) {
      const timestamp = new Date().getTime()
      this.currentFile = `note-${timestamp}.md`
      this.editor.setValue('# New Note\n\nStart writing...')
      const fileNameInput = document.getElementById('notes-filename') as HTMLInputElement
      if (fileNameInput) {
        fileNameInput.value = this.currentFile
      }
      this.updateFileList()
    }
  }

  private saveFile() {
    if (!this.editor) return

    const content = this.editor.getValue()
    localStorage.setItem(`note_${this.currentFile}`, content)
    
    // Save to file list
    const fileList = this.getFileList()
    if (!fileList.includes(this.currentFile)) {
      fileList.push(this.currentFile)
      localStorage.setItem('notes_files', JSON.stringify(fileList))
    }

    this.updateFileList()
    
    // Show notification
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title: 'Note Saved', message: `${this.currentFile} saved successfully`, type: 'success' }
    }))
  }

  private scheduleAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
    }
    this.autoSaveTimer = window.setTimeout(() => {
      this.saveFile()
    }, 2000)
  }

  private loadContent(fileName: string): string {
    const saved = localStorage.getItem(`note_${fileName}`)
    return saved || '# Welcome to Notes\n\nStart writing your markdown notes here...\n\n## Features\n- **Bold** and *italic* text\n- [Links](https://example.com)\n- `Code` blocks\n- Lists and more!\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n'
  }

  private renameFile(newName: string) {
    if (!this.editor || !newName.trim()) return

    const oldName = this.currentFile
    const content = this.editor.getValue()

    // Remove old file
    localStorage.removeItem(`note_${oldName}`)
    
    // Save with new name
    this.currentFile = newName.endsWith('.md') ? newName : `${newName}.md`
    localStorage.setItem(`note_${this.currentFile}`, content)

    // Update file list
    const fileList = this.getFileList()
    const index = fileList.indexOf(oldName)
    if (index > -1) {
      fileList[index] = this.currentFile
    } else {
      fileList.push(this.currentFile)
    }
    localStorage.setItem('notes_files', JSON.stringify(fileList))

    this.updateFileList()
  }

  private getFileList(): string[] {
    const saved = localStorage.getItem('notes_files')
    return saved ? JSON.parse(saved) : []
  }

  private updateFileList() {
    // This will be used when we add a file browser sidebar
  }

  private toggleFileList() {
    // Create a modal with file list
    const files = this.getFileList()
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 23, 42, 0.98);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      padding: 20px;
      z-index: 10000;
      min-width: 400px;
      max-height: 500px;
      overflow-y: auto;
    `

    const title = document.createElement('h3')
    title.textContent = '📁 Your Notes'
    title.style.cssText = 'margin: 0 0 15px 0; color: white;'

    const fileListEl = document.createElement('div')
    fileListEl.style.cssText = 'display: flex; flex-direction: column; gap: 8px;'

    if (files.length === 0) {
      fileListEl.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No saved notes yet</p>'
    } else {
      files.forEach(file => {
        const fileBtn = document.createElement('button')
        fileBtn.textContent = file
        fileBtn.style.cssText = `
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: white;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        `
        fileBtn.addEventListener('mouseenter', () => {
          fileBtn.style.background = 'rgba(255,255,255,0.1)'
        })
        fileBtn.addEventListener('mouseleave', () => {
          fileBtn.style.background = 'rgba(255,255,255,0.05)'
        })
        fileBtn.addEventListener('click', () => {
          this.loadFile(file)
          document.body.removeChild(modal)
          document.body.removeChild(overlay)
        })
        fileListEl.appendChild(fileBtn)
      })
    }

    const closeBtn = this.createButton('✕ Close', () => {
      document.body.removeChild(modal)
      document.body.removeChild(overlay)
    })
    closeBtn.style.marginTop = '15px'
    closeBtn.style.width = '100%'

    modal.append(title, fileListEl, closeBtn)

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    `
    overlay.addEventListener('click', () => {
      document.body.removeChild(modal)
      document.body.removeChild(overlay)
    })

    document.body.append(overlay, modal)
  }

  private loadFile(fileName: string) {
    if (!this.editor) return

    this.currentFile = fileName
    const content = this.loadContent(fileName)
    this.editor.setValue(content)

    const fileNameInput = document.getElementById('notes-filename') as HTMLInputElement
    if (fileNameInput) {
      fileNameInput.value = fileName
    }

    this.updatePreview()
  }

  private exportFile() {
    if (!this.editor) return

    const content = this.editor.getValue()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = this.currentFile
    a.click()
    URL.revokeObjectURL(url)

    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title: 'Note Exported', message: `${this.currentFile} exported successfully`, type: 'success' }
    }))
  }

  destroy() {
    if (this.editor) {
      this.editor.dispose()
    }
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
    }
  }
}
