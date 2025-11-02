const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Notifications
  showNotification: (title, body) => {
    ipcRenderer.send('show-notification', { title, body });
  },
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Launch external applications
  launchApp: (appPath) => ipcRenderer.invoke('launch-app', appPath),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // WhatsApp BrowserView
  showWhatsApp: (bounds) => ipcRenderer.send('show-whatsapp', bounds),
  hideWhatsApp: () => ipcRenderer.send('hide-whatsapp'),
  resizeWhatsApp: (bounds) => ipcRenderer.send('resize-whatsapp', bounds),
  
  // Voice recognition
  startVoiceRecognition: () => ipcRenderer.send('start-voice-recognition'),
  onSpeechText: (callback) => ipcRenderer.on('speech-text', (event, text) => callback(text)),
  
  // Platform detection
  platform: process.platform
});
