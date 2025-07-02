const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();
const os = require('os');
const { registerIpcHandlers } = require('./utils/registerIPC')
// console.log("✅ process.env:", process.env);
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
  console.log("✅ App started and window created.")
}

// ipcMain.handle('run-command', async (event, cmd, args) => {
//   const homeDir = os.homedir();  // ได้ path home ของผู้ใช้ เช่น /home/username หรือ C:\Users\username

//   // แทนที่ ~ ใน cmd กับ args ด้วย homeDir
//   const resolvedCmd = cmd.startsWith('~') ? path.join(homeDir, cmd.slice(1)) : cmd;

//   // const resolvedArgs = args.map(arg => {
//   //   console.log("arg ==> ", arg)
//   //   arg.startsWith('~') ? path.join(homeDir, arg.slice(1)) : arg
//   // }

//   // );

//   return new Promise((resolve, reject) => {
//     const child = spawn(resolvedCmd, args, { shell: true });

//     child.stdout.on('data', (data) => {
//       event.sender.send('command-output', data.toString());
//     });

//     child.stderr.on('data', (data) => {
//       event.sender.send('command-error', data.toString());
//     });

//     child.on('close', (code) => {
//       resolve(`Process exited with code ${code}`);
//     });

//     child.on('error', (err) => {
//       reject(err.message);
//     });
//   });
// });

app.whenReady().then(() => {
  createWindow,
    registerIpcHandlers()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
