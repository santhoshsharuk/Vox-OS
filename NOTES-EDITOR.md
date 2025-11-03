# 📝 Notes Editor - Installation & Usage Guide

## Installation

The Notes app uses Monaco Editor (VS Code's editor) and Marked for markdown rendering. 

### Install Dependencies

```bash
npm install monaco-editor marked
```

Or if using yarn:
```bash
yarn add monaco-editor marked
```

## Features

### ✨ Rich Text Editor
- **Monaco Editor** - The same powerful editor used in VS Code
- Syntax highlighting for Markdown
- Line numbers and minimap
- Auto-save (saves after 2 seconds of inactivity)
- Persistent storage using localStorage

### 📋 Markdown Support
- Full markdown syntax support
- Live preview in split view
- **Bold**, *italic*, `code`, and more
- Code blocks with syntax highlighting
- Tables, lists, blockquotes
- Links and images

### 🎨 View Modes
- **✏️ Edit Mode** - Full editor view
- **⚡ Split Mode** - Editor + live preview side by side
- **👁️ Preview Mode** - Full preview view

### 💾 File Management
- Create new notes
- Save and auto-save
- Rename files
- Load saved notes
- Export as .md files
- File browser modal

### 🎯 Toolbar Features
- File name input (rename on the fly)
- New, Save, Files buttons
- View mode toggles
- Export to .md file

## Usage

### Creating a New Note
1. Open the Notes app from the Start Menu or Desktop
2. Click "📄 New" button
3. Start typing in the editor
4. Auto-save will save after 2 seconds

### Saving Notes
- **Auto-save**: Happens automatically 2 seconds after you stop typing
- **Manual save**: Click the "💾 Save" button

### Viewing Saved Notes
1. Click "📁 Files" button
2. A modal will show all your saved notes
3. Click on any note to open it

### Exporting Notes
1. Click "📥 Export" button
2. Your note will be downloaded as a .md file

### Split View
1. Click "⚡ Split" to see editor and preview side by side
2. Preview updates live as you type
3. Perfect for markdown editing

## Markdown Syntax Examples

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

- List item 1
- List item 2
  - Nested item

1. Numbered list
2. Second item

[Link text](https://example.com)

> Blockquote

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

## Keyboard Shortcuts

Monaco Editor supports many VS Code keyboard shortcuts:

- `Ctrl+S` - Save (browser default, may download)
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+F` - Find
- `Ctrl+H` - Replace
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+Up/Down` - Copy line up/down
- `Ctrl+/` - Toggle line comment
- `F11` - Toggle fullscreen

## Technical Details

### Storage
- Notes are saved in browser's localStorage
- Key format: `note_filename.md`
- File list stored as: `notes_files` (JSON array)

### Monaco Editor Configuration
- Theme: VS Dark
- Language: Markdown
- Word wrap: Enabled
- Minimap: Enabled
- Font size: 14px
- Auto layout: Enabled

### Preview Rendering
- Uses `marked` library for markdown to HTML conversion
- Custom CSS styling for dark theme
- Syntax-highlighted code blocks
- Responsive tables and images

## Troubleshooting

### Monaco Editor Not Loading
If Monaco Editor doesn't load, make sure:
1. Dependencies are installed: `npm install`
2. Vite config is present (vite.config.ts)
3. Check browser console for errors

### Preview Not Updating
- Check if split mode is enabled
- Make sure `marked` is installed
- Refresh the app window

### Auto-save Not Working
- Auto-save triggers 2 seconds after typing stops
- Check browser localStorage is not disabled
- Try manual save with "💾 Save" button

## Future Enhancements

- [ ] Folder organization
- [ ] Search across all notes
- [ ] Tags and categories
- [ ] Import markdown files
- [ ] Multiple tabs for different notes
- [ ] Collaborative editing
- [ ] Cloud sync
- [ ] Dark/Light theme toggle
- [ ] Customizable keyboard shortcuts

## Credits

- **Monaco Editor** - Microsoft (VS Code's editor)
- **Marked** - Markdown parser and compiler
- **Vox OS** - Desktop environment

---

Enjoy your markdown editing experience! 📝✨
