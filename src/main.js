const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config();
const { registerIpcHandlers } = require('./utils/registerIPC');
const { StartApp } = require('./utils/startApp');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('src/index.html');
  console.log("✅ App started and window created.");
}

app.whenReady().then(async () => {
  new StartApp();

  createWindow();
  registerIpcHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

