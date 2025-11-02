// Global type definitions for Electron API
declare global {
  interface Window {
    electronAPI?: {
      showNotification: (title: string, body: string) => void
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      getSystemInfo: () => Promise<SystemInfo>
      launchApp: (appPath: string) => Promise<{ success: boolean; error?: string }>
      openExternal: (url: string) => Promise<{ success: boolean; error?: string }>
      showWhatsApp: (bounds: { x: number; y: number; width: number; height: number }) => void
      hideWhatsApp: () => void
      resizeWhatsApp: (bounds: { x: number; y: number; width: number; height: number }) => void
      platform: string
    }
  }
}

interface SystemInfo {
  platform: string
  arch: string
  version: string
  electronVersion: string
}

export {}
