const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

let mainWindow;

function createWindow() {
  // Get screen size to ensure window is visible
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    x: 100,  // Force position to be on screen
    y: 100,  // Force position to be on screen
    show: true,  // Ensure window shows
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'KhmerGhost - Facebook Account Manager'
  });

  // Load the HTML file
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  
  // Force show the window
  mainWindow.show();
  mainWindow.focus();
  
  // Open DevTools automatically for debugging
  mainWindow.webContents.openDevTools();
  
  // Log when window is ready
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded successfully');
  });
}
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.webContents.openDevTools();
  
  // Open DevTools for debugging (optional - remove for production)
  // mainWindow.webContents.openDevTools();


app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// API bridge from renderer to backend (port 3000)
ipcMain.handle('api-call', async (event, { endpoint, method = 'GET', body = null }) => {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
        
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
        
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ success: false, error: data });
        }
      });
    });
        
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
        
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
});
