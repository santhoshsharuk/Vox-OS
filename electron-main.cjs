const { app, BrowserWindow, ipcMain, Notification, shell, BrowserView } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let whatsappView = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: true,
    transparent: false,
    backgroundColor: '#1e293b',
    icon: path.join(__dirname, 'public/vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      // MUST be true for Web Speech API to work!
      webSecurity: true,
      // Never allow insecure content
      allowRunningInsecureContent: false,
      // Enable sandbox for better security
      sandbox: false // Keep false for preload script access
    }
  });

  // Set Chrome user agent for better compatibility with web apps like WhatsApp
  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Enable permissions for microphone and other media
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'mediaKeySystem', 'geolocation', 'notifications', 'midi', 'midiSysex'];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });

  // Set permissions for specific origins (Google's speech API)
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    if (permission === 'media') {
      return true;
    }
    return false;
  });

  // Load the app
  const isDev = process.env.VITE_DEV_SERVER_URL;
  
  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Hide menu bar for OS-like experience
  mainWindow.setMenuBarVisibility(false);

  // Handle window events
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  console.log('✅ Voice recognition available inside app - click the mic button!');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});



ipcMain.on('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron
  };
});

// Launch external application
ipcMain.handle('launch-app', async (event, appPath) => {
  try {
    if (process.platform === 'win32') {
      // Windows: Launch .exe file
      spawn(appPath, [], { detached: true, stdio: 'ignore' });
      return { success: true };
    } else if (process.platform === 'darwin') {
      // macOS: Use 'open' command
      spawn('open', ['-a', appPath], { detached: true, stdio: 'ignore' });
      return { success: true };
    } else {
      // Linux: Try to execute directly
      spawn(appPath, [], { detached: true, stdio: 'ignore' });
      return { success: true };
    }
  } catch (error) {
    console.error('Error launching app:', error);
    return { success: false, error: error.message };
  }
});

// Open external URL in default browser
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// WhatsApp Web BrowserView management
ipcMain.on('show-whatsapp', (event, bounds) => {
  if (!mainWindow) return;

  if (!whatsappView) {
    whatsappView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    
    // Set Chrome user agent for WhatsApp compatibility
    whatsappView.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    mainWindow.addBrowserView(whatsappView);
    whatsappView.webContents.loadURL('https://web.whatsapp.com');
  }

  whatsappView.setBounds({
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height)
  });
  whatsappView.setAutoResize({ width: true, height: true });
});

ipcMain.on('hide-whatsapp', () => {
  if (whatsappView && mainWindow) {
    mainWindow.removeBrowserView(whatsappView);
    whatsappView.webContents.destroy();
    whatsappView = null;
  }
});

ipcMain.on('resize-whatsapp', (event, bounds) => {
  if (whatsappView) {
    whatsappView.setBounds({
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height)
    });
  }
});
